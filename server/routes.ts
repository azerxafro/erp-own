import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import Razorpay from "razorpay";
import crypto from "crypto";
import { 
  insertUserSchema, insertProductSchema, insertCustomerSchema, 
  insertOrderSchema, insertInventoryTransactionSchema, 
  insertLeadSchema, insertTransactionSchema, 
  insertEmployeeSchema, insertManufacturingOrderSchema,
  insertProductCategorySchema, insertOrderItemSchema
} from "@shared/schema";

// Initialize Razorpay with API keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || ''
});

export async function registerRoutes(app: Express): Promise<Server> {
  // API prefix
  const apiPrefix = "/api";

  // ========== AUTH ROUTES ==========
  app.post(`${apiPrefix}/auth/login`, async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // In a real implementation, use a proper authentication system with JWT or sessions
      // For now, we'll just send back the user without password
      const { password: _, ...userWithoutPassword } = user;
      
      return res.status(200).json({ 
        user: userWithoutPassword,
        message: "Login successful" 
      });
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(`${apiPrefix}/auth/register`, async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(409).json({ message: "Username already taken" });
      }
      
      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(409).json({ message: "Email already taken" });
      }
      
      const user = await storage.insertUser(userData);
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      return res.status(201).json({ 
        user: userWithoutPassword,
        message: "Registration successful" 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error during registration:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // ========== PRODUCT ROUTES ==========
  app.get(`${apiPrefix}/categories`, async (req, res) => {
    try {
      const categories = await storage.getAllProductCategories();
      return res.status(200).json(categories);
    } catch (error) {
      console.error("Error getting product categories:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(`${apiPrefix}/categories`, async (req, res) => {
    try {
      const categoryData = insertProductCategorySchema.parse(req.body);
      const category = await storage.insertProductCategory(categoryData);
      return res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error creating product category:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(`${apiPrefix}/products`, async (req, res) => {
    try {
      const { 
        categoryId, 
        isActive, 
        search, 
        limit = 20, 
        offset = 0 
      } = req.query;
      
      const options: any = {
        limit: Number(limit),
        offset: Number(offset)
      };
      
      if (categoryId) {
        options.categoryId = Number(categoryId);
      }
      
      if (isActive !== undefined) {
        options.isActive = isActive === 'true';
      }
      
      if (search) {
        options.search = search as string;
      }
      
      const products = await storage.getAllProducts(options);
      return res.status(200).json(products);
    } catch (error) {
      console.error("Error getting products:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(`${apiPrefix}/products/:id`, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const product = await storage.getProductById(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      return res.status(200).json(product);
    } catch (error) {
      console.error("Error getting product:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(`${apiPrefix}/products`, async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.insertProduct(productData);
      return res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error creating product:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put(`${apiPrefix}/products/:id`, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const productData = insertProductSchema.partial().parse(req.body);
      
      const existingProduct = await storage.getProductById(id);
      if (!existingProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      const updatedProduct = await storage.updateProduct(id, productData);
      return res.status(200).json(updatedProduct);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error updating product:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // ========== CUSTOMER ROUTES ==========
  app.get(`${apiPrefix}/customers`, async (req, res) => {
    try {
      const { search, limit = 20, offset = 0 } = req.query;
      
      const options: any = {
        limit: Number(limit),
        offset: Number(offset)
      };
      
      if (search) {
        options.search = search as string;
      }
      
      const customers = await storage.getAllCustomers(options);
      return res.status(200).json(customers);
    } catch (error) {
      console.error("Error getting customers:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(`${apiPrefix}/customers/:id`, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const customer = await storage.getCustomerById(id);
      
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      
      return res.status(200).json(customer);
    } catch (error) {
      console.error("Error getting customer:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(`${apiPrefix}/customers`, async (req, res) => {
    try {
      const customerData = insertCustomerSchema.parse(req.body);
      
      // Check if email already exists
      const existingEmail = await storage.getCustomerByEmail(customerData.email);
      if (existingEmail) {
        return res.status(409).json({ message: "Email already taken" });
      }
      
      const customer = await storage.insertCustomer(customerData);
      return res.status(201).json(customer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error creating customer:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put(`${apiPrefix}/customers/:id`, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const customerData = insertCustomerSchema.partial().parse(req.body);
      
      const existingCustomer = await storage.getCustomerById(id);
      if (!existingCustomer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      
      // Check if email is being updated and already exists
      if (customerData.email && customerData.email !== existingCustomer.email) {
        const existingEmail = await storage.getCustomerByEmail(customerData.email);
        if (existingEmail) {
          return res.status(409).json({ message: "Email already taken" });
        }
      }
      
      const updatedCustomer = await storage.updateCustomer(id, customerData);
      return res.status(200).json(updatedCustomer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error updating customer:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // ========== ORDER ROUTES ==========
  app.get(`${apiPrefix}/orders`, async (req, res) => {
    try {
      const { 
        customerId, 
        status, 
        startDate, 
        endDate, 
        limit = 20, 
        offset = 0 
      } = req.query;
      
      const options: any = {
        limit: Number(limit),
        offset: Number(offset)
      };
      
      if (customerId) {
        options.customerId = Number(customerId);
      }
      
      if (status) {
        options.status = status as string;
      }
      
      if (startDate) {
        options.startDate = new Date(startDate as string);
      }
      
      if (endDate) {
        options.endDate = new Date(endDate as string);
      }
      
      const orders = await storage.getAllOrders(options);
      return res.status(200).json(orders);
    } catch (error) {
      console.error("Error getting orders:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(`${apiPrefix}/orders/:id`, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const order = await storage.getOrderById(id);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      return res.status(200).json(order);
    } catch (error) {
      console.error("Error getting order:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(`${apiPrefix}/orders`, async (req, res) => {
    try {
      const { order, items } = req.body;
      
      // Validate order data
      const orderData = insertOrderSchema.parse(order);
      
      // Validate order items
      const orderItems = z.array(insertOrderItemSchema).parse(items);
      
      // Check if customer exists
      if (orderData.customerId) {
        const existingCustomer = await storage.getCustomerById(orderData.customerId);
        if (!existingCustomer) {
          return res.status(404).json({ message: "Customer not found" });
        }
      }
      
      // Create order with items
      const newOrder = await storage.insertOrder(orderData, orderItems);
      
      // Get created order with relations
      const orderWithRelations = await storage.getOrderById(newOrder.id);
      
      return res.status(201).json(orderWithRelations);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error creating order:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch(`${apiPrefix}/orders/:id/status`, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const existingOrder = await storage.getOrderById(id);
      if (!existingOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      const updatedOrder = await storage.updateOrderStatus(id, status);
      return res.status(200).json(updatedOrder);
    } catch (error) {
      console.error("Error updating order status:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // ========== PAYMENT ROUTES (RAZORPAY) ==========
  // Get Razorpay Key ID for client-side use
  app.get(`${apiPrefix}/razorpay-key`, (req, res) => {
    res.json({
      key_id: process.env.RAZORPAY_KEY_ID
    });
  });
  
  // Create a new Razorpay order
  app.post(`${apiPrefix}/create-payment`, async (req, res) => {
    try {
      const { amount, currency = 'INR', receipt, notes = {} } = req.body;
      
      if (!amount) {
        return res.status(400).json({ message: "Amount is required" });
      }
      
      // Create a Razorpay order
      const options = {
        amount: Math.round(amount * 100), // Razorpay expects amount in smallest currency unit (paise for INR)
        currency,
        receipt: receipt || `receipt_${Date.now()}`,
        notes
      };
      
      const order = await razorpay.orders.create(options);
      
      res.status(200).json({
        success: true,
        order
      });
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      return res.status(500).json({ 
        success: false,
        message: error.message || "An error occurred while creating the payment order" 
      });
    }
  });
  
  // Verify Razorpay payment signature
  app.post(`${apiPrefix}/verify-payment`, async (req, res) => {
    try {
      const { 
        razorpay_order_id, 
        razorpay_payment_id, 
        razorpay_signature 
      } = req.body;
      
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ 
          success: false, 
          message: "All payment details are required" 
        });
      }
      
      // Verify signature
      const generated_signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest('hex');
      
      if (generated_signature === razorpay_signature) {
        // Payment is successful and verified
        // Here you would update your order status in the database
        
        return res.status(200).json({
          success: true,
          message: "Payment has been verified"
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Payment verification failed"
        });
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      return res.status(500).json({ 
        success: false,
        message: error.message || "An error occurred while verifying the payment" 
      });
    }
  });

  // ========== INVENTORY ROUTES ==========
  app.get(`${apiPrefix}/inventory`, async (req, res) => {
    try {
      const { 
        productId, 
        type, 
        startDate, 
        endDate, 
        limit = 20, 
        offset = 0 
      } = req.query;
      
      const options: any = {
        limit: Number(limit),
        offset: Number(offset)
      };
      
      if (productId) {
        options.productId = Number(productId);
      }
      
      if (type) {
        options.type = type as string;
      }
      
      if (startDate) {
        options.startDate = new Date(startDate as string);
      }
      
      if (endDate) {
        options.endDate = new Date(endDate as string);
      }
      
      const transactions = await storage.getAllInventoryTransactions(options);
      return res.status(200).json(transactions);
    } catch (error) {
      console.error("Error getting inventory transactions:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(`${apiPrefix}/inventory`, async (req, res) => {
    try {
      const transactionData = insertInventoryTransactionSchema.parse(req.body);
      
      // Check if product exists
      const existingProduct = await storage.getProductById(transactionData.productId);
      if (!existingProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      const transaction = await storage.insertInventoryTransaction(transactionData);
      return res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error creating inventory transaction:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // ========== LEAD ROUTES ==========
  app.get(`${apiPrefix}/leads`, async (req, res) => {
    try {
      const { 
        status, 
        assignedTo, 
        search, 
        limit = 20, 
        offset = 0 
      } = req.query;
      
      const options: any = {
        limit: Number(limit),
        offset: Number(offset)
      };
      
      if (status) {
        options.status = status as string;
      }
      
      if (assignedTo) {
        options.assignedTo = Number(assignedTo);
      }
      
      if (search) {
        options.search = search as string;
      }
      
      const leads = await storage.getAllLeads(options);
      return res.status(200).json(leads);
    } catch (error) {
      console.error("Error getting leads:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(`${apiPrefix}/leads/:id`, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const lead = await storage.getLeadById(id);
      
      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }
      
      return res.status(200).json(lead);
    } catch (error) {
      console.error("Error getting lead:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(`${apiPrefix}/leads`, async (req, res) => {
    try {
      const leadData = insertLeadSchema.parse(req.body);
      
      // Check if assigned user exists if assignedTo is provided
      if (leadData.assignedTo) {
        const existingUser = await storage.getUserById(leadData.assignedTo);
        if (!existingUser) {
          return res.status(404).json({ message: "Assigned user not found" });
        }
      }
      
      const lead = await storage.insertLead(leadData);
      return res.status(201).json(lead);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error creating lead:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put(`${apiPrefix}/leads/:id`, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const leadData = insertLeadSchema.partial().parse(req.body);
      
      const existingLead = await storage.getLeadById(id);
      if (!existingLead) {
        return res.status(404).json({ message: "Lead not found" });
      }
      
      // Check if assigned user exists if assignedTo is provided
      if (leadData.assignedTo) {
        const existingUser = await storage.getUserById(leadData.assignedTo);
        if (!existingUser) {
          return res.status(404).json({ message: "Assigned user not found" });
        }
      }
      
      const updatedLead = await storage.updateLead(id, leadData);
      return res.status(200).json(updatedLead);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error updating lead:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // ========== FINANCE ROUTES ==========
  app.get(`${apiPrefix}/transactions`, async (req, res) => {
    try {
      const { 
        type, 
        category, 
        startDate, 
        endDate, 
        limit = 20, 
        offset = 0 
      } = req.query;
      
      const options: any = {
        limit: Number(limit),
        offset: Number(offset)
      };
      
      if (type) {
        options.type = type as string;
      }
      
      if (category) {
        options.category = category as string;
      }
      
      if (startDate) {
        options.startDate = new Date(startDate as string);
      }
      
      if (endDate) {
        options.endDate = new Date(endDate as string);
      }
      
      const transactions = await storage.getAllTransactions(options);
      return res.status(200).json(transactions);
    } catch (error) {
      console.error("Error getting transactions:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(`${apiPrefix}/transactions/:id`, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const transaction = await storage.getTransactionById(id);
      
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      
      return res.status(200).json(transaction);
    } catch (error) {
      console.error("Error getting transaction:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(`${apiPrefix}/transactions`, async (req, res) => {
    try {
      const transactionData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.insertTransaction(transactionData);
      return res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error creating transaction:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // ========== HR ROUTES ==========
  app.get(`${apiPrefix}/employees`, async (req, res) => {
    try {
      const { 
        department, 
        status, 
        search, 
        limit = 20, 
        offset = 0 
      } = req.query;
      
      const options: any = {
        limit: Number(limit),
        offset: Number(offset)
      };
      
      if (department) {
        options.department = department as string;
      }
      
      if (status) {
        options.status = status as string;
      }
      
      if (search) {
        options.search = search as string;
      }
      
      const employees = await storage.getAllEmployees(options);
      return res.status(200).json(employees);
    } catch (error) {
      console.error("Error getting employees:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(`${apiPrefix}/employees/:id`, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const employee = await storage.getEmployeeById(id);
      
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      
      return res.status(200).json(employee);
    } catch (error) {
      console.error("Error getting employee:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(`${apiPrefix}/employees`, async (req, res) => {
    try {
      const employeeData = insertEmployeeSchema.parse(req.body);
      
      // Check if user exists if userId is provided
      if (employeeData.userId) {
        const existingUser = await storage.getUserById(employeeData.userId);
        if (!existingUser) {
          return res.status(404).json({ message: "User not found" });
        }
      }
      
      const employee = await storage.insertEmployee(employeeData);
      return res.status(201).json(employee);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error creating employee:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put(`${apiPrefix}/employees/:id`, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const employeeData = insertEmployeeSchema.partial().parse(req.body);
      
      const existingEmployee = await storage.getEmployeeById(id);
      if (!existingEmployee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      
      // Check if user exists if userId is provided
      if (employeeData.userId) {
        const existingUser = await storage.getUserById(employeeData.userId);
        if (!existingUser) {
          return res.status(404).json({ message: "User not found" });
        }
      }
      
      const updatedEmployee = await storage.updateEmployee(id, employeeData);
      return res.status(200).json(updatedEmployee);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error updating employee:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // ========== MANUFACTURING ROUTES ==========
  app.get(`${apiPrefix}/manufacturing/orders`, async (req, res) => {
    try {
      const { 
        productId, 
        status, 
        startDate, 
        endDate, 
        limit = 20, 
        offset = 0 
      } = req.query;
      
      const options: any = {
        limit: Number(limit),
        offset: Number(offset)
      };
      
      if (productId) {
        options.productId = Number(productId);
      }
      
      if (status) {
        options.status = status as string;
      }
      
      if (startDate) {
        options.startDate = new Date(startDate as string);
      }
      
      if (endDate) {
        options.endDate = new Date(endDate as string);
      }
      
      const orders = await storage.getAllManufacturingOrders(options);
      return res.status(200).json(orders);
    } catch (error) {
      console.error("Error getting manufacturing orders:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(`${apiPrefix}/manufacturing/orders/:id`, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const order = await storage.getManufacturingOrderById(id);
      
      if (!order) {
        return res.status(404).json({ message: "Manufacturing order not found" });
      }
      
      return res.status(200).json(order);
    } catch (error) {
      console.error("Error getting manufacturing order:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(`${apiPrefix}/manufacturing/orders`, async (req, res) => {
    try {
      const orderData = insertManufacturingOrderSchema.parse(req.body);
      
      // Check if product exists
      const existingProduct = await storage.getProductById(orderData.productId);
      if (!existingProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      const order = await storage.insertManufacturingOrder(orderData);
      return res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error creating manufacturing order:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch(`${apiPrefix}/manufacturing/orders/:id/status`, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const existingOrder = await storage.getManufacturingOrderById(id);
      if (!existingOrder) {
        return res.status(404).json({ message: "Manufacturing order not found" });
      }
      
      const updatedOrder = await storage.updateManufacturingOrderStatus(id, status);
      return res.status(200).json(updatedOrder);
    } catch (error) {
      console.error("Error updating manufacturing order status:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // ========== DASHBOARD STATS ROUTES ==========
  app.get(`${apiPrefix}/dashboard/stats`, async (req, res) => {
    try {
      // Get total revenue
      const incomeTransactions = await storage.getAllTransactions({ type: 'income' });
      const totalRevenue = incomeTransactions.reduce((sum, transaction) => {
        return sum + Number(transaction.amount);
      }, 0);
      
      // Get total orders
      const orders = await storage.getAllOrders();
      const totalOrders = orders.length;
      
      // Get new customers (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const customers = await storage.getAllCustomers();
      const newCustomers = customers.filter(customer => {
        const createdAt = new Date(customer.createdAt);
        return createdAt >= thirtyDaysAgo;
      }).length;
      
      // Get inventory items count
      const products = await storage.getAllProducts();
      const inventoryItems = products.length;
      
      return res.status(200).json({
        totalRevenue,
        totalOrders,
        newCustomers,
        inventoryItems
      });
    } catch (error) {
      console.error("Error getting dashboard stats:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(`${apiPrefix}/dashboard/inventory-status`, async (req, res) => {
    try {
      const categories = await storage.getAllProductCategories();
      const products = await storage.getAllProducts();
      
      const inventoryStatus = await Promise.all(
        categories.map(async (category) => {
          const categoryProducts = products.filter(product => product.categoryId === category.id);
          
          // Calculate stock percentage (simple average of all products in category)
          let stockPercentage = 0;
          
          if (categoryProducts.length > 0) {
            // Assuming each product has an ideal stock level of 100 units
            const idealStock = 100 * categoryProducts.length;
            const currentStock = categoryProducts.reduce((sum, product) => sum + product.stockQuantity, 0);
            stockPercentage = Math.min(Math.round((currentStock / idealStock) * 100), 100);
          }
          
          return {
            id: category.id,
            name: category.name,
            stockPercentage
          };
        })
      );
      
      return res.status(200).json(inventoryStatus);
    } catch (error) {
      console.error("Error getting inventory status:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(`${apiPrefix}/dashboard/recent-orders`, async (req, res) => {
    try {
      const recentOrders = await storage.getAllOrders({ limit: 5 });
      return res.status(200).json(recentOrders);
    } catch (error) {
      console.error("Error getting recent orders:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(`${apiPrefix}/dashboard/customer-activity`, async (req, res) => {
    try {
      // Get recent orders with customer info
      const recentOrders = await storage.getAllOrders({ limit: 4 });
      
      const customerActivity = recentOrders.map(order => {
        return {
          id: order.id,
          customerId: order.customerId,
          customerName: order.customer?.fullName || 'Unknown Customer',
          action: `Placed order #${order.orderNumber}`,
          date: order.createdAt,
          actionType: 'order'
        };
      });
      
      return res.status(200).json(customerActivity);
    } catch (error) {
      console.error("Error getting customer activity:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(`${apiPrefix}/dashboard/sales-trends`, async (req, res) => {
    try {
      const { period = '7days' } = req.query;
      
      let startDate = new Date();
      
      // Set start date based on period
      switch (period) {
        case '7days':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30days':
          startDate.setDate(startDate.getDate() - 30);
          break;
        case '90days':
          startDate.setDate(startDate.getDate() - 90);
          break;
        case '1year':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
        default:
          startDate.setDate(startDate.getDate() - 7);
      }
      
      // Get orders in date range
      const orders = await storage.getAllOrders({
        startDate,
      });
      
      // Group orders by date
      const salesByDate = orders.reduce((acc: any, order) => {
        const date = new Date(order.createdAt).toISOString().split('T')[0];
        
        if (!acc[date]) {
          acc[date] = {
            date,
            sales: 0,
            orders: 0
          };
        }
        
        acc[date].sales += Number(order.total);
        acc[date].orders += 1;
        
        return acc;
      }, {});
      
      // Convert to array and sort by date
      const salesTrends = Object.values(salesByDate).sort((a: any, b: any) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
      
      return res.status(200).json(salesTrends);
    } catch (error) {
      console.error("Error getting sales trends:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(`${apiPrefix}/dashboard/top-products`, async (req, res) => {
    try {
      const { metric = 'revenue' } = req.query;
      
      // Get all order items
      const orders = await storage.getAllOrders();
      
      // Collect all order items
      const allOrderItems: any[] = [];
      orders.forEach(order => {
        if (order.items) {
          allOrderItems.push(...order.items);
        }
      });
      
      // Group by product and calculate totals
      const productTotals = allOrderItems.reduce((acc: any, item) => {
        const productId = item.productId;
        
        if (!acc[productId]) {
          acc[productId] = {
            productId,
            productName: item.product?.name || 'Unknown Product',
            revenue: 0,
            units: 0
          };
        }
        
        acc[productId].revenue += Number(item.total);
        acc[productId].units += item.quantity;
        
        return acc;
      }, {});
      
      // Convert to array and sort by metric
      const sortField = metric === 'revenue' ? 'revenue' : 'units';
      const topProducts = Object.values(productTotals)
        .sort((a: any, b: any) => b[sortField] - a[sortField])
        .slice(0, 5);
      
      return res.status(200).json(topProducts);
    } catch (error) {
      console.error("Error getting top products:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
