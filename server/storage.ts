import { db } from "@db";
import { 
  users, customers, products, productCategories, 
  orders, orderItems, inventoryTransactions, leads,
  transactions, employees, manufacturingOrders
} from "@shared/schema";
import { eq, and, or, desc, asc, sql, gte, lte, like } from "drizzle-orm";
import { InsertUser, InsertProduct, InsertCustomer, InsertOrder, InsertOrderItem, 
  InsertInventoryTransaction, InsertLead, InsertTransaction, InsertEmployee, 
  InsertManufacturingOrder, InsertProductCategory } from "@shared/schema";

// ========== User Operations ==========
export const getUserByUsername = async (username: string) => {
  return await db.query.users.findFirst({
    where: eq(users.username, username)
  });
};

export const getUserByEmail = async (email: string) => {
  return await db.query.users.findFirst({
    where: eq(users.email, email)
  });
};

export const getUserById = async (id: number) => {
  return await db.query.users.findFirst({
    where: eq(users.id, id)
  });
};

export const insertUser = async (user: InsertUser) => {
  const result = await db.insert(users).values(user).returning();
  return result[0];
};

// ========== Product Operations ==========
export const getAllProductCategories = async () => {
  return await db.query.productCategories.findMany({
    orderBy: asc(productCategories.name)
  });
};

export const getProductCategoryById = async (id: number) => {
  return await db.query.productCategories.findFirst({
    where: eq(productCategories.id, id)
  });
};

export const insertProductCategory = async (category: InsertProductCategory) => {
  const result = await db.insert(productCategories).values(category).returning();
  return result[0];
};

export const getAllProducts = async (options: { 
  categoryId?: number,
  isActive?: boolean,
  search?: string,
  limit?: number,
  offset?: number
} = {}) => {
  let query = db.query.products;
  let conditions = [];
  
  if (options.categoryId) {
    conditions.push(eq(products.categoryId, options.categoryId));
  }
  
  if (options.isActive !== undefined) {
    conditions.push(eq(products.isActive, options.isActive));
  }
  
  if (options.search) {
    conditions.push(
      or(
        like(products.name, `%${options.search}%`),
        like(products.description, `%${options.search}%`),
        like(products.sku, `%${options.search}%`)
      )
    );
  }
  
  return await query.findMany({
    where: conditions.length ? and(...conditions) : undefined,
    with: {
      category: true
    },
    limit: options.limit,
    offset: options.offset,
    orderBy: [desc(products.createdAt)]
  });
};

export const getProductById = async (id: number) => {
  return await db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      category: true
    }
  });
};

export const insertProduct = async (product: InsertProduct) => {
  const result = await db.insert(products).values(product).returning();
  return result[0];
};

export const updateProduct = async (id: number, product: Partial<InsertProduct>) => {
  const result = await db.update(products)
    .set({...product, updatedAt: new Date()})
    .where(eq(products.id, id))
    .returning();
  return result[0];
};

export const updateProductStock = async (id: number, stockChange: number) => {
  const result = await db.update(products)
    .set({
      stockQuantity: sql`${products.stockQuantity} + ${stockChange}`,
      updatedAt: new Date()
    })
    .where(eq(products.id, id))
    .returning();
  return result[0];
};

// ========== Customer Operations ==========
export const getAllCustomers = async (options: {
  search?: string,
  limit?: number,
  offset?: number
} = {}) => {
  let query = db.query.customers;
  let conditions = [];
  
  if (options.search) {
    conditions.push(
      or(
        like(customers.email, `%${options.search}%`),
        like(customers.fullName, `%${options.search}%`),
        like(customers.phone, `%${options.search}%`)
      )
    );
  }
  
  return await query.findMany({
    where: conditions.length ? and(...conditions) : undefined,
    limit: options.limit,
    offset: options.offset,
    orderBy: [desc(customers.createdAt)]
  });
};

export const getCustomerById = async (id: number) => {
  return await db.query.customers.findFirst({
    where: eq(customers.id, id),
    with: {
      orders: {
        orderBy: [desc(orders.createdAt)]
      }
    }
  });
};

export const getCustomerByEmail = async (email: string) => {
  return await db.query.customers.findFirst({
    where: eq(customers.email, email)
  });
};

export const insertCustomer = async (customer: InsertCustomer) => {
  const result = await db.insert(customers).values(customer).returning();
  return result[0];
};

export const updateCustomer = async (id: number, customer: Partial<InsertCustomer>) => {
  const result = await db.update(customers)
    .set({...customer, updatedAt: new Date()})
    .where(eq(customers.id, id))
    .returning();
  return result[0];
};

// ========== Order Operations ==========
export const getAllOrders = async (options: {
  customerId?: number,
  status?: string,
  startDate?: Date,
  endDate?: Date,
  limit?: number,
  offset?: number
} = {}) => {
  let query = db.query.orders;
  let conditions = [];
  
  if (options.customerId) {
    conditions.push(eq(orders.customerId, options.customerId));
  }
  
  if (options.status) {
    conditions.push(eq(orders.status, options.status));
  }
  
  if (options.startDate) {
    conditions.push(gte(orders.createdAt, options.startDate));
  }
  
  if (options.endDate) {
    conditions.push(lte(orders.createdAt, options.endDate));
  }
  
  return await query.findMany({
    where: conditions.length ? and(...conditions) : undefined,
    with: {
      customer: true,
      items: {
        with: {
          product: true
        }
      }
    },
    limit: options.limit,
    offset: options.offset,
    orderBy: [desc(orders.createdAt)]
  });
};

export const getOrderById = async (id: number) => {
  return await db.query.orders.findFirst({
    where: eq(orders.id, id),
    with: {
      customer: true,
      items: {
        with: {
          product: true
        }
      }
    }
  });
};

export const getOrderByOrderNumber = async (orderNumber: string) => {
  return await db.query.orders.findFirst({
    where: eq(orders.orderNumber, orderNumber),
    with: {
      customer: true,
      items: {
        with: {
          product: true
        }
      }
    }
  });
};

export const insertOrder = async (order: InsertOrder, items: InsertOrderItem[]) => {
  let result;
  
  // Use transaction to ensure both order and items are created together
  await db.transaction(async (tx) => {
    const [newOrder] = await tx.insert(orders).values(order).returning();
    result = newOrder;
    
    if (items.length > 0) {
      const orderItems = items.map(item => ({
        ...item,
        orderId: newOrder.id
      }));
      
      await tx.insert(orderItems).values(orderItems);
      
      // Update product stock quantities
      for (const item of items) {
        await tx.update(products)
          .set({
            stockQuantity: sql`${products.stockQuantity} - ${item.quantity}`,
            updatedAt: new Date()
          })
          .where(eq(products.id, item.productId));
      }
    }
  });
  
  return result;
};

export const updateOrderStatus = async (id: number, status: string) => {
  const result = await db.update(orders)
    .set({status, updatedAt: new Date()})
    .where(eq(orders.id, id))
    .returning();
  return result[0];
};

// ========== Inventory Operations ==========
export const getAllInventoryTransactions = async (options: {
  productId?: number,
  type?: string,
  startDate?: Date,
  endDate?: Date,
  limit?: number,
  offset?: number
} = {}) => {
  let query = db.query.inventoryTransactions;
  let conditions = [];
  
  if (options.productId) {
    conditions.push(eq(inventoryTransactions.productId, options.productId));
  }
  
  if (options.type) {
    conditions.push(eq(inventoryTransactions.type, options.type));
  }
  
  if (options.startDate) {
    conditions.push(gte(inventoryTransactions.createdAt, options.startDate));
  }
  
  if (options.endDate) {
    conditions.push(lte(inventoryTransactions.createdAt, options.endDate));
  }
  
  return await query.findMany({
    where: conditions.length ? and(...conditions) : undefined,
    with: {
      product: true
    },
    limit: options.limit,
    offset: options.offset,
    orderBy: [desc(inventoryTransactions.createdAt)]
  });
};

export const insertInventoryTransaction = async (transaction: InsertInventoryTransaction) => {
  let result;
  
  // Use transaction to ensure both inventory transaction is created and product stock is updated
  await db.transaction(async (tx) => {
    const [newTransaction] = await tx.insert(inventoryTransactions).values(transaction).returning();
    result = newTransaction;
    
    // Update product stock quantity
    await tx.update(products)
      .set({
        stockQuantity: sql`${products.stockQuantity} + ${transaction.quantity}`,
        updatedAt: new Date()
      })
      .where(eq(products.id, transaction.productId));
  });
  
  return result;
};

// ========== Lead Operations ==========
export const getAllLeads = async (options: {
  status?: string,
  assignedTo?: number,
  search?: string,
  limit?: number,
  offset?: number
} = {}) => {
  let query = db.query.leads;
  let conditions = [];
  
  if (options.status) {
    conditions.push(eq(leads.status, options.status));
  }
  
  if (options.assignedTo) {
    conditions.push(eq(leads.assignedTo, options.assignedTo));
  }
  
  if (options.search) {
    conditions.push(
      or(
        like(leads.fullName, `%${options.search}%`),
        like(leads.email, `%${options.search}%`),
        like(leads.company, `%${options.search}%`)
      )
    );
  }
  
  return await query.findMany({
    where: conditions.length ? and(...conditions) : undefined,
    with: {
      assignedUser: true
    },
    limit: options.limit,
    offset: options.offset,
    orderBy: [desc(leads.createdAt)]
  });
};

export const getLeadById = async (id: number) => {
  return await db.query.leads.findFirst({
    where: eq(leads.id, id),
    with: {
      assignedUser: true
    }
  });
};

export const insertLead = async (lead: InsertLead) => {
  const result = await db.insert(leads).values(lead).returning();
  return result[0];
};

export const updateLead = async (id: number, lead: Partial<InsertLead>) => {
  const result = await db.update(leads)
    .set({...lead, updatedAt: new Date()})
    .where(eq(leads.id, id))
    .returning();
  return result[0];
};

// ========== Finance Operations ==========
export const getAllTransactions = async (options: {
  type?: string,
  category?: string,
  startDate?: Date,
  endDate?: Date,
  limit?: number,
  offset?: number
} = {}) => {
  let query = db.query.transactions;
  let conditions = [];
  
  if (options.type) {
    conditions.push(eq(transactions.type, options.type));
  }
  
  if (options.category) {
    conditions.push(eq(transactions.category, options.category));
  }
  
  if (options.startDate) {
    conditions.push(gte(transactions.date, options.startDate));
  }
  
  if (options.endDate) {
    conditions.push(lte(transactions.date, options.endDate));
  }
  
  return await query.findMany({
    where: conditions.length ? and(...conditions) : undefined,
    limit: options.limit,
    offset: options.offset,
    orderBy: [desc(transactions.date)]
  });
};

export const getTransactionById = async (id: number) => {
  return await db.query.transactions.findFirst({
    where: eq(transactions.id, id)
  });
};

export const insertTransaction = async (transaction: InsertTransaction) => {
  const result = await db.insert(transactions).values(transaction).returning();
  return result[0];
};

// ========== HR Operations ==========
export const getAllEmployees = async (options: {
  department?: string,
  status?: string,
  search?: string,
  limit?: number,
  offset?: number
} = {}) => {
  let query = db.query.employees;
  let conditions = [];
  
  if (options.department) {
    conditions.push(eq(employees.department, options.department));
  }
  
  if (options.status) {
    conditions.push(eq(employees.status, options.status));
  }
  
  if (options.search) {
    conditions.push(
      or(
        like(employees.fullName, `%${options.search}%`),
        like(employees.email, `%${options.search}%`),
        like(employees.position, `%${options.search}%`)
      )
    );
  }
  
  return await query.findMany({
    where: conditions.length ? and(...conditions) : undefined,
    limit: options.limit,
    offset: options.offset,
    orderBy: [asc(employees.fullName)]
  });
};

export const getEmployeeById = async (id: number) => {
  return await db.query.employees.findFirst({
    where: eq(employees.id, id)
  });
};

export const insertEmployee = async (employee: InsertEmployee) => {
  const result = await db.insert(employees).values(employee).returning();
  return result[0];
};

export const updateEmployee = async (id: number, employee: Partial<InsertEmployee>) => {
  const result = await db.update(employees)
    .set({...employee, updatedAt: new Date()})
    .where(eq(employees.id, id))
    .returning();
  return result[0];
};

// ========== Manufacturing Operations ==========
export const getAllManufacturingOrders = async (options: {
  productId?: number,
  status?: string,
  startDate?: Date,
  endDate?: Date,
  limit?: number,
  offset?: number
} = {}) => {
  let query = db.query.manufacturingOrders;
  let conditions = [];
  
  if (options.productId) {
    conditions.push(eq(manufacturingOrders.productId, options.productId));
  }
  
  if (options.status) {
    conditions.push(eq(manufacturingOrders.status, options.status));
  }
  
  if (options.startDate) {
    conditions.push(gte(manufacturingOrders.startDate, options.startDate));
  }
  
  if (options.endDate) {
    conditions.push(lte(manufacturingOrders.completionDate, options.endDate));
  }
  
  return await query.findMany({
    where: conditions.length ? and(...conditions) : undefined,
    with: {
      product: true
    },
    limit: options.limit,
    offset: options.offset,
    orderBy: [desc(manufacturingOrders.createdAt)]
  });
};

export const getManufacturingOrderById = async (id: number) => {
  return await db.query.manufacturingOrders.findFirst({
    where: eq(manufacturingOrders.id, id),
    with: {
      product: true
    }
  });
};

export const insertManufacturingOrder = async (order: InsertManufacturingOrder) => {
  const result = await db.insert(manufacturingOrders).values(order).returning();
  return result[0];
};

export const updateManufacturingOrderStatus = async (id: number, status: string) => {
  const result = await db.update(manufacturingOrders)
    .set({status, updatedAt: new Date()})
    .where(eq(manufacturingOrders.id, id))
    .returning();
  return result[0];
};

export const storage = {
  // User operations
  getUserByUsername,
  getUserByEmail,
  getUserById,
  insertUser,
  
  // Product operations
  getAllProductCategories,
  getProductCategoryById,
  insertProductCategory,
  getAllProducts,
  getProductById,
  insertProduct,
  updateProduct,
  updateProductStock,
  
  // Customer operations
  getAllCustomers,
  getCustomerById,
  getCustomerByEmail,
  insertCustomer,
  updateCustomer,
  
  // Order operations
  getAllOrders,
  getOrderById,
  getOrderByOrderNumber,
  insertOrder,
  updateOrderStatus,
  
  // Inventory operations
  getAllInventoryTransactions,
  insertInventoryTransaction,
  
  // Lead operations
  getAllLeads,
  getLeadById,
  insertLead,
  updateLead,
  
  // Finance operations
  getAllTransactions,
  getTransactionById,
  insertTransaction,
  
  // HR operations
  getAllEmployees,
  getEmployeeById,
  insertEmployee,
  updateEmployee,
  
  // Manufacturing operations
  getAllManufacturingOrders,
  getManufacturingOrderById,
  insertManufacturingOrder,
  updateManufacturingOrderStatus
};
