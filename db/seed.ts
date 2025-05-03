import { db } from "./index";
import * as schema from "@shared/schema";
import { 
  users,
  productCategories,
  products,
  customers,
  orders,
  orderItems,
  leads,
  employees,
  transactions,
  manufacturingOrders,
  inventoryTransactions
} from "@shared/schema";

async function seed() {
  try {
    console.log("Starting database seed...");

    // Seed users
    const adminUser = await db.insert(users).values({
      username: "admin",
      password: "admin123", // In a real app, use bcrypt or another hashing library
      email: "admin@unierp.com",
      fullName: "System Admin",
      role: "admin"
    }).returning().then(res => res[0]);
    
    const salesUser = await db.insert(users).values({
      username: "sales",
      password: "sales123",
      email: "sales@unierp.com",
      fullName: "Sales Manager",
      role: "sales"
    }).returning().then(res => res[0]);
    
    const inventoryUser = await db.insert(users).values({
      username: "inventory",
      password: "inventory123",
      email: "inventory@unierp.com",
      fullName: "Inventory Manager",
      role: "inventory"
    }).returning().then(res => res[0]);
    
    console.log("Users created successfully!");

    // Seed product categories
    const categories = await db.insert(productCategories).values([
      { name: "Electronics", description: "Electronic devices and accessories" },
      { name: "Clothing", description: "Apparel and fashion items" },
      { name: "Home Goods", description: "Home decorations and appliances" },
      { name: "Office Supplies", description: "Office equipment and stationery" },
      { name: "Food & Beverages", description: "Consumable food products" }
    ]).returning();
    
    console.log("Product categories created successfully!");

    // Seed products
    const productList = [
      { 
        name: "Wireless Headphones", 
        description: "High-quality wireless headphones with noise cancellation", 
        sku: "WH-1001", 
        price: 129.99, 
        costPrice: 70.00,
        categoryId: categories[0].id, 
        stockQuantity: 78,
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"
      },
      { 
        name: "Smartphone", 
        description: "Latest model smartphone with advanced features", 
        sku: "SP-2002", 
        price: 799.99, 
        costPrice: 450.00,
        categoryId: categories[0].id, 
        stockQuantity: 45,
        imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600"
      },
      { 
        name: "Laptop", 
        description: "Powerful laptop for work and gaming", 
        sku: "LP-3003", 
        price: 1299.99, 
        costPrice: 800.00,
        categoryId: categories[0].id, 
        stockQuantity: 25,
        imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600"
      },
      { 
        name: "T-Shirt", 
        description: "Comfortable cotton t-shirt", 
        sku: "TS-4001", 
        price: 19.99, 
        costPrice: 5.00,
        categoryId: categories[1].id, 
        stockQuantity: 92,
        imageUrl: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600"
      },
      { 
        name: "Jeans", 
        description: "Classic denim jeans", 
        sku: "JN-4002", 
        price: 49.99, 
        costPrice: 15.00,
        categoryId: categories[1].id, 
        stockQuantity: 34,
        imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600"
      },
      { 
        name: "Table Lamp", 
        description: "Modern table lamp for home decoration", 
        sku: "TL-5001", 
        price: 34.99, 
        costPrice: 18.00,
        categoryId: categories[2].id, 
        stockQuantity: 62,
        imageUrl: "https://images.unsplash.com/photo-1543198126-b705673a5e94?w=600"
      },
      { 
        name: "Sofa", 
        description: "Comfortable three-seater sofa", 
        sku: "SF-5002", 
        price: 499.99, 
        costPrice: 250.00,
        categoryId: categories[2].id, 
        stockQuantity: 15,
        imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600"
      },
      { 
        name: "Notebook", 
        description: "Premium quality lined notebook", 
        sku: "NB-6001", 
        price: 12.99, 
        costPrice: 3.00,
        categoryId: categories[3].id, 
        stockQuantity: 15,
        imageUrl: "https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?w=600"
      },
      { 
        name: "Pen Set", 
        description: "Set of 10 colored pens", 
        sku: "PS-6002", 
        price: 8.99, 
        costPrice: 2.50,
        categoryId: categories[3].id, 
        stockQuantity: 62,
        imageUrl: "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=600"
      },
      { 
        name: "Coffee Beans", 
        description: "Premium Arabica coffee beans", 
        sku: "CB-7001", 
        price: 14.99, 
        costPrice: 7.00,
        categoryId: categories[4].id, 
        stockQuantity: 62,
        imageUrl: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600"
      }
    ];
    
    const productEntries = await db.insert(products).values(productList).returning();
    
    console.log("Products created successfully!");

    // Seed customers
    const customersList = [
      {
        email: "jessica.smith@example.com",
        fullName: "Jessica Smith",
        phone: "555-123-4567",
        address: "123 Main St",
        city: "New York",
        state: "NY",
        country: "USA",
        postalCode: "10001"
      },
      {
        email: "marcus.johnson@example.com",
        fullName: "Marcus Johnson",
        phone: "555-234-5678",
        address: "456 Elm St",
        city: "Los Angeles",
        state: "CA",
        country: "USA",
        postalCode: "90001"
      },
      {
        email: "rachel.chen@example.com",
        fullName: "Rachel Chen",
        phone: "555-345-6789",
        address: "789 Oak St",
        city: "Chicago",
        state: "IL",
        country: "USA",
        postalCode: "60601"
      },
      {
        email: "thomas.wright@example.com",
        fullName: "Thomas Wright",
        phone: "555-456-7890",
        address: "101 Pine St",
        city: "Miami",
        state: "FL",
        country: "USA",
        postalCode: "33101"
      },
      {
        email: "olivia.martinez@example.com",
        fullName: "Olivia Martinez",
        phone: "555-567-8901",
        address: "202 Cedar St",
        city: "Seattle",
        state: "WA",
        country: "USA",
        postalCode: "98101"
      }
    ];
    
    const customerEntries = await db.insert(customers).values(customersList).returning();
    
    console.log("Customers created successfully!");

    // Seed orders
    const ordersList = [
      {
        orderNumber: "ORD-3829",
        customerId: customerEntries[0].id,
        status: "delivered",
        total: 239.45,
        tax: 19.95,
        shipping: 10.00,
        shippingAddress: JSON.stringify(customersList[0]),
        billingAddress: JSON.stringify(customersList[0]),
        paymentMethod: "credit_card",
        createdAt: new Date("2023-08-31T10:00:00Z")
      },
      {
        orderNumber: "ORD-3828",
        customerId: customerEntries[1].id,
        status: "processing",
        total: 427.89,
        tax: 35.65,
        shipping: 15.00,
        shippingAddress: JSON.stringify(customersList[1]),
        billingAddress: JSON.stringify(customersList[1]),
        paymentMethod: "paypal",
        createdAt: new Date("2023-08-30T14:30:00Z")
      },
      {
        orderNumber: "ORD-3827",
        customerId: customerEntries[2].id,
        status: "shipped",
        total: 112.50,
        tax: 9.38,
        shipping: 8.75,
        shippingAddress: JSON.stringify(customersList[2]),
        billingAddress: JSON.stringify(customersList[2]),
        paymentMethod: "credit_card",
        createdAt: new Date("2023-08-29T09:15:00Z")
      },
      {
        orderNumber: "ORD-3826",
        customerId: customerEntries[3].id,
        status: "canceled",
        total: 84.99,
        tax: 7.08,
        shipping: 5.00,
        shippingAddress: JSON.stringify(customersList[3]),
        billingAddress: JSON.stringify(customersList[3]),
        paymentMethod: "credit_card",
        createdAt: new Date("2023-08-28T16:45:00Z")
      },
      {
        orderNumber: "ORD-3825",
        customerId: customerEntries[4].id,
        status: "delivered",
        total: 358.75,
        tax: 29.90,
        shipping: 12.50,
        shippingAddress: JSON.stringify(customersList[4]),
        billingAddress: JSON.stringify(customersList[4]),
        paymentMethod: "paypal",
        createdAt: new Date("2023-08-27T11:20:00Z")
      }
    ];
    
    const orderEntries = await db.insert(orders).values(ordersList).returning();
    
    console.log("Orders created successfully!");

    // Seed order items
    const orderItemsList = [
      {
        orderId: orderEntries[0].id,
        productId: productEntries[0].id,
        quantity: 1,
        price: 129.99,
        total: 129.99
      },
      {
        orderId: orderEntries[0].id,
        productId: productEntries[3].id,
        quantity: 2,
        price: 19.99,
        total: 39.98
      },
      {
        orderId: orderEntries[1].id,
        productId: productEntries[1].id,
        quantity: 1,
        price: 799.99,
        total: 799.99
      },
      {
        orderId: orderEntries[2].id,
        productId: productEntries[7].id,
        quantity: 3,
        price: 12.99,
        total: 38.97
      },
      {
        orderId: orderEntries[2].id,
        productId: productEntries[8].id,
        quantity: 2,
        price: 8.99,
        total: 17.98
      },
      {
        orderId: orderEntries[3].id,
        productId: productEntries[5].id,
        quantity: 1,
        price: 34.99,
        total: 34.99
      },
      {
        orderId: orderEntries[4].id,
        productId: productEntries[2].id,
        quantity: 1,
        price: 1299.99,
        total: 1299.99
      }
    ];
    
    await db.insert(orderItems).values(orderItemsList);
    
    console.log("Order items created successfully!");

    // Seed inventory transactions
    const inventoryTransactionsList = [
      {
        productId: productEntries[0].id,
        type: "received",
        quantity: 100,
        reference: "PO-1001",
        notes: "Initial stock"
      },
      {
        productId: productEntries[1].id,
        type: "received",
        quantity: 50,
        reference: "PO-1002",
        notes: "Initial stock"
      },
      {
        productId: productEntries[2].id,
        type: "received",
        quantity: 30,
        reference: "PO-1003",
        notes: "Initial stock"
      },
      {
        productId: productEntries[0].id,
        type: "shipped",
        quantity: -22,
        reference: "ORD-3829",
        notes: "Order fulfillment"
      },
      {
        productId: productEntries[1].id,
        type: "shipped",
        quantity: -5,
        reference: "ORD-3828",
        notes: "Order fulfillment"
      }
    ];
    
    await db.insert(inventoryTransactions).values(inventoryTransactionsList);
    
    console.log("Inventory transactions created successfully!");

    // Seed leads
    const leadsList = [
      {
        fullName: "James Wilson",
        email: "james.wilson@example.com",
        phone: "555-987-6543",
        company: "ABC Corporation",
        status: "new",
        source: "website",
        notes: "Interested in enterprise plan"
      },
      {
        fullName: "Emily Brown",
        email: "emily.brown@example.com",
        phone: "555-876-5432",
        company: "XYZ Industries",
        status: "contacted",
        source: "referral",
        notes: "Follow up next week",
        assignedTo: salesUser.id
      },
      {
        fullName: "Michael Davis",
        email: "michael.davis@example.com",
        phone: "555-765-4321",
        company: "Acme Inc",
        status: "qualified",
        source: "trade_show",
        notes: "Send product demo",
        assignedTo: salesUser.id
      },
      {
        fullName: "Sarah Miller",
        email: "sarah.miller@example.com",
        phone: "555-654-3210",
        company: "Global Solutions",
        status: "negotiation",
        source: "website",
        notes: "Discussing pricing options"
      }
    ];
    
    await db.insert(leads).values(leadsList);
    
    console.log("Leads created successfully!");

    // Seed financial transactions
    const transactionsList = [
      {
        type: "income",
        category: "sales",
        amount: 239.45,
        description: "Order ORD-3829",
        reference: "ORD-3829",
        date: new Date("2023-08-31T10:00:00Z")
      },
      {
        type: "income",
        category: "sales",
        amount: 427.89,
        description: "Order ORD-3828",
        reference: "ORD-3828",
        date: new Date("2023-08-30T14:30:00Z")
      },
      {
        type: "income",
        category: "sales",
        amount: 112.50,
        description: "Order ORD-3827",
        reference: "ORD-3827",
        date: new Date("2023-08-29T09:15:00Z")
      },
      {
        type: "income",
        category: "sales",
        amount: 358.75,
        description: "Order ORD-3825",
        reference: "ORD-3825",
        date: new Date("2023-08-27T11:20:00Z")
      },
      {
        type: "expense",
        category: "inventory",
        amount: -8500.00,
        description: "Inventory purchase PO-1001",
        reference: "PO-1001",
        date: new Date("2023-08-25T13:45:00Z")
      },
      {
        type: "expense",
        category: "payroll",
        amount: -12500.00,
        description: "August payroll",
        reference: "PAY-2023-08",
        date: new Date("2023-08-28T09:00:00Z")
      },
      {
        type: "expense",
        category: "rent",
        amount: -3500.00,
        description: "Office rent - August",
        reference: "RENT-2023-08",
        date: new Date("2023-08-01T14:00:00Z")
      }
    ];
    
    await db.insert(transactions).values(transactionsList);
    
    console.log("Financial transactions created successfully!");

    // Seed employees
    const employeesList = [
      {
        userId: adminUser.id,
        fullName: "John Doe",
        email: "john.doe@unierp.com",
        phone: "555-111-2222",
        position: "CEO",
        department: "Executive",
        hireDate: new Date("2020-01-15T09:00:00Z"),
        salary: 120000.00,
        status: "active"
      },
      {
        userId: salesUser.id,
        fullName: "Jane Smith",
        email: "jane.smith@unierp.com",
        phone: "555-222-3333",
        position: "Sales Manager",
        department: "Sales",
        hireDate: new Date("2020-03-10T09:00:00Z"),
        salary: 85000.00,
        status: "active"
      },
      {
        userId: inventoryUser.id,
        fullName: "Robert Johnson",
        email: "robert.johnson@unierp.com",
        phone: "555-333-4444",
        position: "Inventory Manager",
        department: "Operations",
        hireDate: new Date("2020-05-20T09:00:00Z"),
        salary: 75000.00,
        status: "active"
      },
      {
        fullName: "Maria Garcia",
        email: "maria.garcia@unierp.com",
        phone: "555-444-5555",
        position: "HR Specialist",
        department: "Human Resources",
        hireDate: new Date("2021-01-10T09:00:00Z"),
        salary: 65000.00,
        status: "active"
      },
      {
        fullName: "David Kim",
        email: "david.kim@unierp.com",
        phone: "555-555-6666",
        position: "Financial Analyst",
        department: "Finance",
        hireDate: new Date("2021-03-15T09:00:00Z"),
        salary: 72000.00,
        status: "active"
      }
    ];
    
    await db.insert(employees).values(employeesList);
    
    console.log("Employees created successfully!");

    // Seed manufacturing orders
    const manufacturingOrdersList = [
      {
        orderNumber: "MO-1001",
        productId: productEntries[0].id,
        quantity: 50,
        status: "completed",
        startDate: new Date("2023-07-15T09:00:00Z"),
        completionDate: new Date("2023-07-25T14:00:00Z"),
        notes: "Regular production run"
      },
      {
        orderNumber: "MO-1002",
        productId: productEntries[1].id,
        quantity: 25,
        status: "in_progress",
        startDate: new Date("2023-08-10T09:00:00Z"),
        notes: "Special edition model"
      },
      {
        orderNumber: "MO-1003",
        productId: productEntries[3].id,
        quantity: 100,
        status: "planned",
        startDate: new Date("2023-09-05T09:00:00Z"),
        notes: "Fall collection"
      },
      {
        orderNumber: "MO-1004",
        productId: productEntries[7].id,
        quantity: 200,
        status: "planned",
        startDate: new Date("2023-09-10T09:00:00Z"),
        notes: "Back to school special"
      }
    ];
    
    await db.insert(manufacturingOrders).values(manufacturingOrdersList);
    
    console.log("Manufacturing orders created successfully!");

    console.log("Database seed completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
