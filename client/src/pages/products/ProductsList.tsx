import React, { useState } from "react";
import Breadcrumb from "@/components/common/Breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Search, 
  PlusCircle, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Package, 
  Edit, 
  Trash2, 
  Image
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

const ProductsList: React.FC = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    sku: "",
    price: "",
    costPrice: "",
    categoryId: "",
    stockQuantity: "0",
    imageUrl: ""
  });
  const pageSize = 10;
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const breadcrumbItems = [
    { label: 'Admin', href: '/admin' },
    { label: 'Products' }
  ];

  // Get all products
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['/api/products', 
      { 
        search, 
        categoryId: categoryFilter !== 'all' ? parseInt(categoryFilter) : undefined,
        isActive: activeFilter !== 'all' ? activeFilter === 'active' : undefined,
        page: currentPage,
        limit: pageSize 
      }
    ],
  });

  // Get product categories for filter and form
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/categories'],
  });

  // Create new product mutation
  const createProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      const response = await apiRequest('POST', '/api/products', productData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: "Product created",
        description: "The product has been created successfully.",
      });
      // Reset form
      setNewProduct({
        name: "",
        description: "",
        sku: "",
        price: "",
        costPrice: "",
        categoryId: "",
        stockQuantity: "0",
        imageUrl: ""
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create product: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Prepare product data
    const productData = {
      ...newProduct,
      categoryId: newProduct.categoryId ? parseInt(newProduct.categoryId) : undefined,
      stockQuantity: parseInt(newProduct.stockQuantity),
      isActive: true
    };
    createProductMutation.mutate(productData);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setNewProduct(prev => ({ ...prev, [id]: value }));
  };

  // Calculate total products and pages for pagination
  const totalProducts = productsData?.length || 0;
  const totalPages = Math.ceil(totalProducts / pageSize);

  // Handle pagination
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Product Management</h1>
        <div className="flex space-x-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new product.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input 
                      id="name" 
                      value={newProduct.name}
                      onChange={handleInputChange}
                      className="col-span-3" 
                      placeholder="Product name" 
                      required 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="description" className="text-right pt-2">
                      Description
                    </Label>
                    <Textarea 
                      id="description" 
                      value={newProduct.description}
                      onChange={handleInputChange}
                      className="col-span-3" 
                      placeholder="Product description" 
                      required 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="sku" className="text-right">
                      SKU
                    </Label>
                    <Input 
                      id="sku" 
                      value={newProduct.sku}
                      onChange={handleInputChange}
                      className="col-span-3" 
                      placeholder="Stock keeping unit" 
                      required 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">
                      Price
                    </Label>
                    <Input 
                      id="price" 
                      type="number" 
                      step="0.01"
                      value={newProduct.price}
                      onChange={handleInputChange}
                      className="col-span-3" 
                      placeholder="0.00" 
                      required 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="costPrice" className="text-right">
                      Cost Price
                    </Label>
                    <Input 
                      id="costPrice" 
                      type="number" 
                      step="0.01"
                      value={newProduct.costPrice}
                      onChange={handleInputChange}
                      className="col-span-3" 
                      placeholder="0.00" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="categoryId" className="text-right">
                      Category
                    </Label>
                    <Select 
                      value={newProduct.categoryId} 
                      onValueChange={(value) => setNewProduct(prev => ({ ...prev, categoryId: value }))}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoriesData?.map((category: any) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="stockQuantity" className="text-right">
                      Stock Quantity
                    </Label>
                    <Input 
                      id="stockQuantity" 
                      type="number"
                      value={newProduct.stockQuantity}
                      onChange={handleInputChange}
                      className="col-span-3" 
                      placeholder="0" 
                      required 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="imageUrl" className="text-right">
                      Image URL
                    </Label>
                    <Input 
                      id="imageUrl" 
                      value={newProduct.imageUrl}
                      onChange={handleInputChange}
                      className="col-span-3" 
                      placeholder="https://example.com/image.jpg" 
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={createProductMutation.isPending}>
                    {createProductMutation.isPending ? "Creating..." : "Add Product"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <CardTitle>Products</CardTitle>
              <CardDescription>
                Manage your product catalog
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input 
                  type="search" 
                  placeholder="Search products..." 
                  className="pl-8 w-full" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categoriesData?.map((category: any) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={activeFilter} onValueChange={setActiveFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {productsLoading || categoriesLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productsData?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-4">
                          No products found. Try adjusting your filters.
                        </TableCell>
                      </TableRow>
                    ) : (
                      productsData?.map((product: any) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            {product.imageUrl ? (
                              <div className="h-10 w-10 rounded-md overflow-hidden bg-gray-100">
                                <img 
                                  src={product.imageUrl} 
                                  alt={product.name} 
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="h-10 w-10 flex items-center justify-center rounded-md bg-gray-100">
                                <Package className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium max-w-[200px] truncate">
                            {product.name}
                          </TableCell>
                          <TableCell>{product.sku}</TableCell>
                          <TableCell>{product.category?.name || 'Uncategorized'}</TableCell>
                          <TableCell>{formatCurrency(product.price)}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                              product.stockQuantity > 10 ? 'bg-green-100 text-green-800' : 
                              product.stockQuantity > 0 ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'
                            }>
                              {product.stockQuantity}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={product.isActive ? "default" : "secondary"}
                              className={product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                            >
                              {product.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(product.updatedAt)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500">
                  Showing <span className="font-medium">{Math.min((currentPage - 1) * pageSize + 1, totalProducts)}</span> to{" "}
                  <span className="font-medium">{Math.min(currentPage * pageSize, totalProducts)}</span> of{" "}
                  <span className="font-medium">{totalProducts}</span> products
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={prevPage} 
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous Page</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={nextPage}
                    disabled={currentPage === totalPages || totalPages === 0}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next Page</span>
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsList;
