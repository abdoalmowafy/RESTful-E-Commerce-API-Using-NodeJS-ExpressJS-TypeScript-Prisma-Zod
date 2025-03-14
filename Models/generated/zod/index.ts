import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const AddressScalarFieldEnumSchema = z.enum(['id','apartment','floor','building','street','city','state','country','postalCode','userId','createdAt','updatedAt','deleted','deletedAt']);

export const CartScalarFieldEnumSchema = z.enum(['id','promoCodeId']);

export const CartItemScalarFieldEnumSchema = z.enum(['id','productId','quantity','cartId']);

export const CategoryScalarFieldEnumSchema = z.enum(['id','name']);

export const OrderScalarFieldEnumSchema = z.enum(['id','userId','transporterId','promoCodeId','totalCents','currency','paymentMethod','deliveryNeeded','status','PaymobOrderId','deliveryAddressId','createdAt','updatedAt','deliveredAt','deleted','deletedAt']);

export const OrderItemScalarFieldEnumSchema = z.enum(['orderId','productId','productPriceCents','productSalePercent','quantity','warrantyDays']);

export const ProductScalarFieldEnumSchema = z.enum(['id','name','sku','description','stock','views','priceCents','salePercent','warrantyDays','categoryId','createdAt','updatedAt','deleted']);

export const PromoCodeScalarFieldEnumSchema = z.enum(['id','code','description','discountPercent','maxDiscountCents','validFrom','validUntil']);

export const ReturnScalarFieldEnumSchema = z.enum(['id','reason','status','userId','transporterId','createdAt','updatedAt','deleted','deletedAt']);

export const ReviewScalarFieldEnumSchema = z.enum(['id','productId','userId','rating','comment','createdAt','updatedAt','deleted','deletedAt']);

export const SearchScalarFieldEnumSchema = z.enum(['id','keyWord','userId','categoryId']);

export const UserScalarFieldEnumSchema = z.enum(['id','email','emailVerified','passwordHash','name','gender','dob','phone','phoneVerified','role','cartId','createdAt','updatedAt','deleted','deletedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const OrderStatusSchema = z.enum(['PAYING','PROCESSING','ON_THE_WAY','DELIVERED','CANCELLED']);

export type OrderStatusType = `${z.infer<typeof OrderStatusSchema>}`

export const PaymentMethodSchema = z.enum(['COD','CREDITCARD','MOBILEWALLET']);

export type PaymentMethodType = `${z.infer<typeof PaymentMethodSchema>}`

export const RoleSchema = z.enum(['ADMIN','MODERATOR','TRANSPORTER','NOROLE']);

export type RoleType = `${z.infer<typeof RoleSchema>}`

export const GenderSchema = z.enum(['MALE','FEMALE']);

export type GenderType = `${z.infer<typeof GenderSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// ADDRESS SCHEMA
/////////////////////////////////////////

export const AddressSchema = z.object({
  id: z.string().uuid(),
  apartment: z.string(),
  floor: z.string(),
  building: z.string(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  postalCode: z.string(),
  userId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullish(),
  deleted: z.boolean(),
  deletedAt: z.coerce.date().nullish(),
})

export type Address = z.infer<typeof AddressSchema>

// ADDRESS RELATION SCHEMA
//------------------------------------------------------

export type AddressRelations = {
  user: UserWithRelations;
  Order: OrderWithRelations[];
};

export type AddressWithRelations = z.infer<typeof AddressSchema> & AddressRelations

export const AddressWithRelationsSchema: z.ZodType<AddressWithRelations> = AddressSchema.merge(z.object({
  user: z.lazy(() => UserWithRelationsSchema),
  Order: z.lazy(() => OrderWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// CART SCHEMA
/////////////////////////////////////////

export const CartSchema = z.object({
  id: z.string().uuid(),
  promoCodeId: z.string().nullish(),
})

export type Cart = z.infer<typeof CartSchema>

// CART RELATION SCHEMA
//------------------------------------------------------

export type CartRelations = {
  cartItems: CartItemWithRelations[];
  promoCode?: PromoCodeWithRelations | null;
  user?: UserWithRelations | null;
};

export type CartWithRelations = z.infer<typeof CartSchema> & CartRelations

export const CartWithRelationsSchema: z.ZodType<CartWithRelations> = CartSchema.merge(z.object({
  cartItems: z.lazy(() => CartItemWithRelationsSchema).array(),
  promoCode: z.lazy(() => PromoCodeWithRelationsSchema).nullish(),
  user: z.lazy(() => UserWithRelationsSchema).nullish(),
}))

/////////////////////////////////////////
// CART ITEM SCHEMA
/////////////////////////////////////////

export const CartItemSchema = z.object({
  id: z.string().uuid(),
  productId: z.string(),
  quantity: z.number().int(),
  cartId: z.string(),
})

export type CartItem = z.infer<typeof CartItemSchema>

// CART ITEM RELATION SCHEMA
//------------------------------------------------------

export type CartItemRelations = {
  product: ProductWithRelations;
  cart: CartWithRelations;
};

export type CartItemWithRelations = z.infer<typeof CartItemSchema> & CartItemRelations

export const CartItemWithRelationsSchema: z.ZodType<CartItemWithRelations> = CartItemSchema.merge(z.object({
  product: z.lazy(() => ProductWithRelationsSchema),
  cart: z.lazy(() => CartWithRelationsSchema),
}))

/////////////////////////////////////////
// CATEGORY SCHEMA
/////////////////////////////////////////

export const CategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
})

export type Category = z.infer<typeof CategorySchema>

// CATEGORY RELATION SCHEMA
//------------------------------------------------------

export type CategoryRelations = {
  products: ProductWithRelations[];
  search: searchWithRelations[];
};

export type CategoryWithRelations = z.infer<typeof CategorySchema> & CategoryRelations

export const CategoryWithRelationsSchema: z.ZodType<CategoryWithRelations> = CategorySchema.merge(z.object({
  products: z.lazy(() => ProductWithRelationsSchema).array(),
  search: z.lazy(() => searchWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// ORDER SCHEMA
/////////////////////////////////////////

export const OrderSchema = z.object({
  paymentMethod: PaymentMethodSchema,
  status: OrderStatusSchema,
  id: z.string().uuid(),
  userId: z.string(),
  transporterId: z.string().nullish(),
  promoCodeId: z.string().nullish(),
  totalCents: z.number().int(),
  currency: z.string(),
  deliveryNeeded: z.boolean(),
  PaymobOrderId: z.string().nullish(),
  deliveryAddressId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deliveredAt: z.coerce.date().nullish(),
  deleted: z.boolean(),
  deletedAt: z.coerce.date().nullish(),
})

export type Order = z.infer<typeof OrderSchema>

// ORDER RELATION SCHEMA
//------------------------------------------------------

export type OrderRelations = {
  user: UserWithRelations;
  transporter?: UserWithRelations | null;
  orderItems: OrderItemWithRelations[];
  promoCode?: PromoCodeWithRelations | null;
  deliveryAddress: AddressWithRelations;
};

export type OrderWithRelations = z.infer<typeof OrderSchema> & OrderRelations

export const OrderWithRelationsSchema: z.ZodType<OrderWithRelations> = OrderSchema.merge(z.object({
  user: z.lazy(() => UserWithRelationsSchema),
  transporter: z.lazy(() => UserWithRelationsSchema).nullish(),
  orderItems: z.lazy(() => OrderItemWithRelationsSchema).array(),
  promoCode: z.lazy(() => PromoCodeWithRelationsSchema).nullish(),
  deliveryAddress: z.lazy(() => AddressWithRelationsSchema),
}))

/////////////////////////////////////////
// ORDER ITEM SCHEMA
/////////////////////////////////////////

export const OrderItemSchema = z.object({
  orderId: z.string(),
  productId: z.string(),
  productPriceCents: z.number().int(),
  productSalePercent: z.number().int(),
  quantity: z.number().int(),
  warrantyDays: z.number().int(),
})

export type OrderItem = z.infer<typeof OrderItemSchema>

// ORDER ITEM RELATION SCHEMA
//------------------------------------------------------

export type OrderItemRelations = {
  order: OrderWithRelations;
  product: ProductWithRelations;
};

export type OrderItemWithRelations = z.infer<typeof OrderItemSchema> & OrderItemRelations

export const OrderItemWithRelationsSchema: z.ZodType<OrderItemWithRelations> = OrderItemSchema.merge(z.object({
  order: z.lazy(() => OrderWithRelationsSchema),
  product: z.lazy(() => ProductWithRelationsSchema),
}))

/////////////////////////////////////////
// PRODUCT SCHEMA
/////////////////////////////////////////

export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  sku: z.string(),
  description: z.string(),
  stock: z.number().int(),
  views: z.number().int(),
  priceCents: z.number().int(),
  salePercent: z.number().int(),
  warrantyDays: z.number().int(),
  categoryId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deleted: z.boolean(),
})

export type Product = z.infer<typeof ProductSchema>

// PRODUCT RELATION SCHEMA
//------------------------------------------------------

export type ProductRelations = {
  reviews: ReviewWithRelations[];
  category: CategoryWithRelations;
  wishers: UserWithRelations[];
  CartItem: CartItemWithRelations[];
  OrderItem: OrderItemWithRelations[];
};

export type ProductWithRelations = z.infer<typeof ProductSchema> & ProductRelations

export const ProductWithRelationsSchema: z.ZodType<ProductWithRelations> = ProductSchema.merge(z.object({
  reviews: z.lazy(() => ReviewWithRelationsSchema).array(),
  category: z.lazy(() => CategoryWithRelationsSchema),
  wishers: z.lazy(() => UserWithRelationsSchema).array(),
  CartItem: z.lazy(() => CartItemWithRelationsSchema).array(),
  OrderItem: z.lazy(() => OrderItemWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// PROMO CODE SCHEMA
/////////////////////////////////////////

export const PromoCodeSchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  description: z.string(),
  discountPercent: z.number().int(),
  maxDiscountCents: z.number().int(),
  validFrom: z.coerce.date(),
  validUntil: z.coerce.date(),
})

export type PromoCode = z.infer<typeof PromoCodeSchema>

// PROMO CODE RELATION SCHEMA
//------------------------------------------------------

export type PromoCodeRelations = {
  cart: CartWithRelations[];
  Order: OrderWithRelations[];
};

export type PromoCodeWithRelations = z.infer<typeof PromoCodeSchema> & PromoCodeRelations

export const PromoCodeWithRelationsSchema: z.ZodType<PromoCodeWithRelations> = PromoCodeSchema.merge(z.object({
  cart: z.lazy(() => CartWithRelationsSchema).array(),
  Order: z.lazy(() => OrderWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// RETURN SCHEMA
/////////////////////////////////////////

export const ReturnSchema = z.object({
  id: z.string().uuid(),
  reason: z.string(),
  status: z.string(),
  userId: z.string(),
  transporterId: z.string().nullish(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deleted: z.boolean(),
  deletedAt: z.coerce.date().nullish(),
})

export type Return = z.infer<typeof ReturnSchema>

// RETURN RELATION SCHEMA
//------------------------------------------------------

export type ReturnRelations = {
  User: UserWithRelations;
  transporter?: UserWithRelations | null;
};

export type ReturnWithRelations = z.infer<typeof ReturnSchema> & ReturnRelations

export const ReturnWithRelationsSchema: z.ZodType<ReturnWithRelations> = ReturnSchema.merge(z.object({
  User: z.lazy(() => UserWithRelationsSchema),
  transporter: z.lazy(() => UserWithRelationsSchema).nullish(),
}))

/////////////////////////////////////////
// REVIEW SCHEMA
/////////////////////////////////////////

export const ReviewSchema = z.object({
  id: z.string().uuid(),
  productId: z.string(),
  userId: z.string(),
  rating: z.number().int(),
  comment: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deleted: z.boolean(),
  deletedAt: z.coerce.date().nullish(),
})

export type Review = z.infer<typeof ReviewSchema>

// REVIEW RELATION SCHEMA
//------------------------------------------------------

export type ReviewRelations = {
  product: ProductWithRelations;
  user: UserWithRelations;
};

export type ReviewWithRelations = z.infer<typeof ReviewSchema> & ReviewRelations

export const ReviewWithRelationsSchema: z.ZodType<ReviewWithRelations> = ReviewSchema.merge(z.object({
  product: z.lazy(() => ProductWithRelationsSchema),
  user: z.lazy(() => UserWithRelationsSchema),
}))

/////////////////////////////////////////
// SEARCH SCHEMA
/////////////////////////////////////////

export const searchSchema = z.object({
  id: z.string().uuid(),
  keyWord: z.string(),
  userId: z.string().nullish(),
  categoryId: z.string(),
})

export type search = z.infer<typeof searchSchema>

// SEARCH RELATION SCHEMA
//------------------------------------------------------

export type searchRelations = {
  user?: UserWithRelations | null;
  category: CategoryWithRelations;
};

export type searchWithRelations = z.infer<typeof searchSchema> & searchRelations

export const searchWithRelationsSchema: z.ZodType<searchWithRelations> = searchSchema.merge(z.object({
  user: z.lazy(() => UserWithRelationsSchema).nullish(),
  category: z.lazy(() => CategoryWithRelationsSchema),
}))

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  gender: GenderSchema,
  role: RoleSchema,
  id: z.string().uuid(),
  email: z.string(),
  emailVerified: z.boolean(),
  passwordHash: z.string(),
  name: z.string(),
  dob: z.coerce.date(),
  phone: z.string().nullish(),
  phoneVerified: z.boolean(),
  cartId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deleted: z.boolean(),
  deletedAt: z.coerce.date().nullish(),
})

export type User = z.infer<typeof UserSchema>

// USER RELATION SCHEMA
//------------------------------------------------------

export type UserRelations = {
  cart: CartWithRelations;
  addresses: AddressWithRelations[];
  wishlist: ProductWithRelations[];
  orders: OrderWithRelations[];
  returns: ReturnWithRelations[];
  orderTranports: OrderWithRelations[];
  returnTransports: ReturnWithRelations[];
  Review: ReviewWithRelations[];
  search: searchWithRelations[];
};

export type UserWithRelations = z.infer<typeof UserSchema> & UserRelations

export const UserWithRelationsSchema: z.ZodType<UserWithRelations> = UserSchema.merge(z.object({
  cart: z.lazy(() => CartWithRelationsSchema),
  addresses: z.lazy(() => AddressWithRelationsSchema).array(),
  wishlist: z.lazy(() => ProductWithRelationsSchema).array(),
  orders: z.lazy(() => OrderWithRelationsSchema).array(),
  returns: z.lazy(() => ReturnWithRelationsSchema).array(),
  orderTranports: z.lazy(() => OrderWithRelationsSchema).array(),
  returnTransports: z.lazy(() => ReturnWithRelationsSchema).array(),
  Review: z.lazy(() => ReviewWithRelationsSchema).array(),
  search: z.lazy(() => searchWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// ADDRESS
//------------------------------------------------------

export const AddressIncludeSchema: z.ZodType<Prisma.AddressInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  Order: z.union([z.boolean(),z.lazy(() => OrderFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => AddressCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const AddressArgsSchema: z.ZodType<Prisma.AddressDefaultArgs> = z.object({
  select: z.lazy(() => AddressSelectSchema).optional(),
  include: z.lazy(() => AddressIncludeSchema).optional(),
}).strict();

export const AddressCountOutputTypeArgsSchema: z.ZodType<Prisma.AddressCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => AddressCountOutputTypeSelectSchema).nullish(),
}).strict();

export const AddressCountOutputTypeSelectSchema: z.ZodType<Prisma.AddressCountOutputTypeSelect> = z.object({
  Order: z.boolean().optional(),
}).strict();

export const AddressSelectSchema: z.ZodType<Prisma.AddressSelect> = z.object({
  id: z.boolean().optional(),
  apartment: z.boolean().optional(),
  floor: z.boolean().optional(),
  building: z.boolean().optional(),
  street: z.boolean().optional(),
  city: z.boolean().optional(),
  state: z.boolean().optional(),
  country: z.boolean().optional(),
  postalCode: z.boolean().optional(),
  userId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  deleted: z.boolean().optional(),
  deletedAt: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  Order: z.union([z.boolean(),z.lazy(() => OrderFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => AddressCountOutputTypeArgsSchema)]).optional(),
}).strict()

// CART
//------------------------------------------------------

export const CartIncludeSchema: z.ZodType<Prisma.CartInclude> = z.object({
  cartItems: z.union([z.boolean(),z.lazy(() => CartItemFindManyArgsSchema)]).optional(),
  promoCode: z.union([z.boolean(),z.lazy(() => PromoCodeArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CartCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const CartArgsSchema: z.ZodType<Prisma.CartDefaultArgs> = z.object({
  select: z.lazy(() => CartSelectSchema).optional(),
  include: z.lazy(() => CartIncludeSchema).optional(),
}).strict();

export const CartCountOutputTypeArgsSchema: z.ZodType<Prisma.CartCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CartCountOutputTypeSelectSchema).nullish(),
}).strict();

export const CartCountOutputTypeSelectSchema: z.ZodType<Prisma.CartCountOutputTypeSelect> = z.object({
  cartItems: z.boolean().optional(),
}).strict();

export const CartSelectSchema: z.ZodType<Prisma.CartSelect> = z.object({
  id: z.boolean().optional(),
  promoCodeId: z.boolean().optional(),
  cartItems: z.union([z.boolean(),z.lazy(() => CartItemFindManyArgsSchema)]).optional(),
  promoCode: z.union([z.boolean(),z.lazy(() => PromoCodeArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CartCountOutputTypeArgsSchema)]).optional(),
}).strict()

// CART ITEM
//------------------------------------------------------

export const CartItemIncludeSchema: z.ZodType<Prisma.CartItemInclude> = z.object({
  product: z.union([z.boolean(),z.lazy(() => ProductArgsSchema)]).optional(),
  cart: z.union([z.boolean(),z.lazy(() => CartArgsSchema)]).optional(),
}).strict()

export const CartItemArgsSchema: z.ZodType<Prisma.CartItemDefaultArgs> = z.object({
  select: z.lazy(() => CartItemSelectSchema).optional(),
  include: z.lazy(() => CartItemIncludeSchema).optional(),
}).strict();

export const CartItemSelectSchema: z.ZodType<Prisma.CartItemSelect> = z.object({
  id: z.boolean().optional(),
  productId: z.boolean().optional(),
  quantity: z.boolean().optional(),
  cartId: z.boolean().optional(),
  product: z.union([z.boolean(),z.lazy(() => ProductArgsSchema)]).optional(),
  cart: z.union([z.boolean(),z.lazy(() => CartArgsSchema)]).optional(),
}).strict()

// CATEGORY
//------------------------------------------------------

export const CategoryIncludeSchema: z.ZodType<Prisma.CategoryInclude> = z.object({
  products: z.union([z.boolean(),z.lazy(() => ProductFindManyArgsSchema)]).optional(),
  search: z.union([z.boolean(),z.lazy(() => searchFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CategoryCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const CategoryArgsSchema: z.ZodType<Prisma.CategoryDefaultArgs> = z.object({
  select: z.lazy(() => CategorySelectSchema).optional(),
  include: z.lazy(() => CategoryIncludeSchema).optional(),
}).strict();

export const CategoryCountOutputTypeArgsSchema: z.ZodType<Prisma.CategoryCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CategoryCountOutputTypeSelectSchema).nullish(),
}).strict();

export const CategoryCountOutputTypeSelectSchema: z.ZodType<Prisma.CategoryCountOutputTypeSelect> = z.object({
  products: z.boolean().optional(),
  search: z.boolean().optional(),
}).strict();

export const CategorySelectSchema: z.ZodType<Prisma.CategorySelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  products: z.union([z.boolean(),z.lazy(() => ProductFindManyArgsSchema)]).optional(),
  search: z.union([z.boolean(),z.lazy(() => searchFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CategoryCountOutputTypeArgsSchema)]).optional(),
}).strict()

// ORDER
//------------------------------------------------------

export const OrderIncludeSchema: z.ZodType<Prisma.OrderInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  transporter: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  orderItems: z.union([z.boolean(),z.lazy(() => OrderItemFindManyArgsSchema)]).optional(),
  promoCode: z.union([z.boolean(),z.lazy(() => PromoCodeArgsSchema)]).optional(),
  deliveryAddress: z.union([z.boolean(),z.lazy(() => AddressArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => OrderCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const OrderArgsSchema: z.ZodType<Prisma.OrderDefaultArgs> = z.object({
  select: z.lazy(() => OrderSelectSchema).optional(),
  include: z.lazy(() => OrderIncludeSchema).optional(),
}).strict();

export const OrderCountOutputTypeArgsSchema: z.ZodType<Prisma.OrderCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => OrderCountOutputTypeSelectSchema).nullish(),
}).strict();

export const OrderCountOutputTypeSelectSchema: z.ZodType<Prisma.OrderCountOutputTypeSelect> = z.object({
  orderItems: z.boolean().optional(),
}).strict();

export const OrderSelectSchema: z.ZodType<Prisma.OrderSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  transporterId: z.boolean().optional(),
  promoCodeId: z.boolean().optional(),
  totalCents: z.boolean().optional(),
  currency: z.boolean().optional(),
  paymentMethod: z.boolean().optional(),
  deliveryNeeded: z.boolean().optional(),
  status: z.boolean().optional(),
  PaymobOrderId: z.boolean().optional(),
  deliveryAddressId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  deliveredAt: z.boolean().optional(),
  deleted: z.boolean().optional(),
  deletedAt: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  transporter: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  orderItems: z.union([z.boolean(),z.lazy(() => OrderItemFindManyArgsSchema)]).optional(),
  promoCode: z.union([z.boolean(),z.lazy(() => PromoCodeArgsSchema)]).optional(),
  deliveryAddress: z.union([z.boolean(),z.lazy(() => AddressArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => OrderCountOutputTypeArgsSchema)]).optional(),
}).strict()

// ORDER ITEM
//------------------------------------------------------

export const OrderItemIncludeSchema: z.ZodType<Prisma.OrderItemInclude> = z.object({
  order: z.union([z.boolean(),z.lazy(() => OrderArgsSchema)]).optional(),
  product: z.union([z.boolean(),z.lazy(() => ProductArgsSchema)]).optional(),
}).strict()

export const OrderItemArgsSchema: z.ZodType<Prisma.OrderItemDefaultArgs> = z.object({
  select: z.lazy(() => OrderItemSelectSchema).optional(),
  include: z.lazy(() => OrderItemIncludeSchema).optional(),
}).strict();

export const OrderItemSelectSchema: z.ZodType<Prisma.OrderItemSelect> = z.object({
  orderId: z.boolean().optional(),
  productId: z.boolean().optional(),
  productPriceCents: z.boolean().optional(),
  productSalePercent: z.boolean().optional(),
  quantity: z.boolean().optional(),
  warrantyDays: z.boolean().optional(),
  order: z.union([z.boolean(),z.lazy(() => OrderArgsSchema)]).optional(),
  product: z.union([z.boolean(),z.lazy(() => ProductArgsSchema)]).optional(),
}).strict()

// PRODUCT
//------------------------------------------------------

export const ProductIncludeSchema: z.ZodType<Prisma.ProductInclude> = z.object({
  reviews: z.union([z.boolean(),z.lazy(() => ReviewFindManyArgsSchema)]).optional(),
  category: z.union([z.boolean(),z.lazy(() => CategoryArgsSchema)]).optional(),
  wishers: z.union([z.boolean(),z.lazy(() => UserFindManyArgsSchema)]).optional(),
  CartItem: z.union([z.boolean(),z.lazy(() => CartItemFindManyArgsSchema)]).optional(),
  OrderItem: z.union([z.boolean(),z.lazy(() => OrderItemFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ProductCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const ProductArgsSchema: z.ZodType<Prisma.ProductDefaultArgs> = z.object({
  select: z.lazy(() => ProductSelectSchema).optional(),
  include: z.lazy(() => ProductIncludeSchema).optional(),
}).strict();

export const ProductCountOutputTypeArgsSchema: z.ZodType<Prisma.ProductCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ProductCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ProductCountOutputTypeSelectSchema: z.ZodType<Prisma.ProductCountOutputTypeSelect> = z.object({
  reviews: z.boolean().optional(),
  wishers: z.boolean().optional(),
  CartItem: z.boolean().optional(),
  OrderItem: z.boolean().optional(),
}).strict();

export const ProductSelectSchema: z.ZodType<Prisma.ProductSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  sku: z.boolean().optional(),
  description: z.boolean().optional(),
  stock: z.boolean().optional(),
  views: z.boolean().optional(),
  priceCents: z.boolean().optional(),
  salePercent: z.boolean().optional(),
  warrantyDays: z.boolean().optional(),
  categoryId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  deleted: z.boolean().optional(),
  reviews: z.union([z.boolean(),z.lazy(() => ReviewFindManyArgsSchema)]).optional(),
  category: z.union([z.boolean(),z.lazy(() => CategoryArgsSchema)]).optional(),
  wishers: z.union([z.boolean(),z.lazy(() => UserFindManyArgsSchema)]).optional(),
  CartItem: z.union([z.boolean(),z.lazy(() => CartItemFindManyArgsSchema)]).optional(),
  OrderItem: z.union([z.boolean(),z.lazy(() => OrderItemFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ProductCountOutputTypeArgsSchema)]).optional(),
}).strict()

// PROMO CODE
//------------------------------------------------------

export const PromoCodeIncludeSchema: z.ZodType<Prisma.PromoCodeInclude> = z.object({
  cart: z.union([z.boolean(),z.lazy(() => CartFindManyArgsSchema)]).optional(),
  Order: z.union([z.boolean(),z.lazy(() => OrderFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => PromoCodeCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const PromoCodeArgsSchema: z.ZodType<Prisma.PromoCodeDefaultArgs> = z.object({
  select: z.lazy(() => PromoCodeSelectSchema).optional(),
  include: z.lazy(() => PromoCodeIncludeSchema).optional(),
}).strict();

export const PromoCodeCountOutputTypeArgsSchema: z.ZodType<Prisma.PromoCodeCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => PromoCodeCountOutputTypeSelectSchema).nullish(),
}).strict();

export const PromoCodeCountOutputTypeSelectSchema: z.ZodType<Prisma.PromoCodeCountOutputTypeSelect> = z.object({
  cart: z.boolean().optional(),
  Order: z.boolean().optional(),
}).strict();

export const PromoCodeSelectSchema: z.ZodType<Prisma.PromoCodeSelect> = z.object({
  id: z.boolean().optional(),
  code: z.boolean().optional(),
  description: z.boolean().optional(),
  discountPercent: z.boolean().optional(),
  maxDiscountCents: z.boolean().optional(),
  validFrom: z.boolean().optional(),
  validUntil: z.boolean().optional(),
  cart: z.union([z.boolean(),z.lazy(() => CartFindManyArgsSchema)]).optional(),
  Order: z.union([z.boolean(),z.lazy(() => OrderFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => PromoCodeCountOutputTypeArgsSchema)]).optional(),
}).strict()

// RETURN
//------------------------------------------------------

export const ReturnIncludeSchema: z.ZodType<Prisma.ReturnInclude> = z.object({
  User: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  transporter: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const ReturnArgsSchema: z.ZodType<Prisma.ReturnDefaultArgs> = z.object({
  select: z.lazy(() => ReturnSelectSchema).optional(),
  include: z.lazy(() => ReturnIncludeSchema).optional(),
}).strict();

export const ReturnSelectSchema: z.ZodType<Prisma.ReturnSelect> = z.object({
  id: z.boolean().optional(),
  reason: z.boolean().optional(),
  status: z.boolean().optional(),
  userId: z.boolean().optional(),
  transporterId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  deleted: z.boolean().optional(),
  deletedAt: z.boolean().optional(),
  User: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  transporter: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// REVIEW
//------------------------------------------------------

export const ReviewIncludeSchema: z.ZodType<Prisma.ReviewInclude> = z.object({
  product: z.union([z.boolean(),z.lazy(() => ProductArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const ReviewArgsSchema: z.ZodType<Prisma.ReviewDefaultArgs> = z.object({
  select: z.lazy(() => ReviewSelectSchema).optional(),
  include: z.lazy(() => ReviewIncludeSchema).optional(),
}).strict();

export const ReviewSelectSchema: z.ZodType<Prisma.ReviewSelect> = z.object({
  id: z.boolean().optional(),
  productId: z.boolean().optional(),
  userId: z.boolean().optional(),
  rating: z.boolean().optional(),
  comment: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  deleted: z.boolean().optional(),
  deletedAt: z.boolean().optional(),
  product: z.union([z.boolean(),z.lazy(() => ProductArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// SEARCH
//------------------------------------------------------

export const searchIncludeSchema: z.ZodType<Prisma.searchInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  category: z.union([z.boolean(),z.lazy(() => CategoryArgsSchema)]).optional(),
}).strict()

export const searchArgsSchema: z.ZodType<Prisma.searchDefaultArgs> = z.object({
  select: z.lazy(() => searchSelectSchema).optional(),
  include: z.lazy(() => searchIncludeSchema).optional(),
}).strict();

export const searchSelectSchema: z.ZodType<Prisma.searchSelect> = z.object({
  id: z.boolean().optional(),
  keyWord: z.boolean().optional(),
  userId: z.boolean().optional(),
  categoryId: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  category: z.union([z.boolean(),z.lazy(() => CategoryArgsSchema)]).optional(),
}).strict()

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  cart: z.union([z.boolean(),z.lazy(() => CartArgsSchema)]).optional(),
  addresses: z.union([z.boolean(),z.lazy(() => AddressFindManyArgsSchema)]).optional(),
  wishlist: z.union([z.boolean(),z.lazy(() => ProductFindManyArgsSchema)]).optional(),
  orders: z.union([z.boolean(),z.lazy(() => OrderFindManyArgsSchema)]).optional(),
  returns: z.union([z.boolean(),z.lazy(() => ReturnFindManyArgsSchema)]).optional(),
  orderTranports: z.union([z.boolean(),z.lazy(() => OrderFindManyArgsSchema)]).optional(),
  returnTransports: z.union([z.boolean(),z.lazy(() => ReturnFindManyArgsSchema)]).optional(),
  Review: z.union([z.boolean(),z.lazy(() => ReviewFindManyArgsSchema)]).optional(),
  search: z.union([z.boolean(),z.lazy(() => searchFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  addresses: z.boolean().optional(),
  wishlist: z.boolean().optional(),
  orders: z.boolean().optional(),
  returns: z.boolean().optional(),
  orderTranports: z.boolean().optional(),
  returnTransports: z.boolean().optional(),
  Review: z.boolean().optional(),
  search: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  email: z.boolean().optional(),
  emailVerified: z.boolean().optional(),
  passwordHash: z.boolean().optional(),
  name: z.boolean().optional(),
  gender: z.boolean().optional(),
  dob: z.boolean().optional(),
  phone: z.boolean().optional(),
  phoneVerified: z.boolean().optional(),
  role: z.boolean().optional(),
  cartId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  deleted: z.boolean().optional(),
  deletedAt: z.boolean().optional(),
  cart: z.union([z.boolean(),z.lazy(() => CartArgsSchema)]).optional(),
  addresses: z.union([z.boolean(),z.lazy(() => AddressFindManyArgsSchema)]).optional(),
  wishlist: z.union([z.boolean(),z.lazy(() => ProductFindManyArgsSchema)]).optional(),
  orders: z.union([z.boolean(),z.lazy(() => OrderFindManyArgsSchema)]).optional(),
  returns: z.union([z.boolean(),z.lazy(() => ReturnFindManyArgsSchema)]).optional(),
  orderTranports: z.union([z.boolean(),z.lazy(() => OrderFindManyArgsSchema)]).optional(),
  returnTransports: z.union([z.boolean(),z.lazy(() => ReturnFindManyArgsSchema)]).optional(),
  Review: z.union([z.boolean(),z.lazy(() => ReviewFindManyArgsSchema)]).optional(),
  search: z.union([z.boolean(),z.lazy(() => searchFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const AddressWhereInputSchema: z.ZodType<Prisma.AddressWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AddressWhereInputSchema),z.lazy(() => AddressWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AddressWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AddressWhereInputSchema),z.lazy(() => AddressWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  apartment: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  floor: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  building: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  street: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  city: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  state: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  country: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  postalCode: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  Order: z.lazy(() => OrderListRelationFilterSchema).optional()
}).strict();

export const AddressOrderByWithRelationInputSchema: z.ZodType<Prisma.AddressOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  apartment: z.lazy(() => SortOrderSchema).optional(),
  floor: z.lazy(() => SortOrderSchema).optional(),
  building: z.lazy(() => SortOrderSchema).optional(),
  street: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional(),
  postalCode: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deleted: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  Order: z.lazy(() => OrderOrderByRelationAggregateInputSchema).optional()
}).strict();

export const AddressWhereUniqueInputSchema: z.ZodType<Prisma.AddressWhereUniqueInput> = z.object({
  id: z.string().uuid()
})
.and(z.object({
  id: z.string().uuid().optional(),
  AND: z.union([ z.lazy(() => AddressWhereInputSchema),z.lazy(() => AddressWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AddressWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AddressWhereInputSchema),z.lazy(() => AddressWhereInputSchema).array() ]).optional(),
  apartment: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  floor: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  building: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  street: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  city: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  state: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  country: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  postalCode: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  Order: z.lazy(() => OrderListRelationFilterSchema).optional()
}).strict());

export const AddressOrderByWithAggregationInputSchema: z.ZodType<Prisma.AddressOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  apartment: z.lazy(() => SortOrderSchema).optional(),
  floor: z.lazy(() => SortOrderSchema).optional(),
  building: z.lazy(() => SortOrderSchema).optional(),
  street: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional(),
  postalCode: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deleted: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => AddressCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AddressMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AddressMinOrderByAggregateInputSchema).optional()
}).strict();

export const AddressScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AddressScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => AddressScalarWhereWithAggregatesInputSchema),z.lazy(() => AddressScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => AddressScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AddressScalarWhereWithAggregatesInputSchema),z.lazy(() => AddressScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  apartment: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  floor: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  building: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  street: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  city: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  state: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  country: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  postalCode: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  deleted: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const CartWhereInputSchema: z.ZodType<Prisma.CartWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CartWhereInputSchema),z.lazy(() => CartWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CartWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CartWhereInputSchema),z.lazy(() => CartWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  promoCodeId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  cartItems: z.lazy(() => CartItemListRelationFilterSchema).optional(),
  promoCode: z.union([ z.lazy(() => PromoCodeNullableScalarRelationFilterSchema),z.lazy(() => PromoCodeWhereInputSchema) ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserNullableScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
}).strict();

export const CartOrderByWithRelationInputSchema: z.ZodType<Prisma.CartOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  promoCodeId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  cartItems: z.lazy(() => CartItemOrderByRelationAggregateInputSchema).optional(),
  promoCode: z.lazy(() => PromoCodeOrderByWithRelationInputSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const CartWhereUniqueInputSchema: z.ZodType<Prisma.CartWhereUniqueInput> = z.object({
  id: z.string().uuid()
})
.and(z.object({
  id: z.string().uuid().optional(),
  AND: z.union([ z.lazy(() => CartWhereInputSchema),z.lazy(() => CartWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CartWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CartWhereInputSchema),z.lazy(() => CartWhereInputSchema).array() ]).optional(),
  promoCodeId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  cartItems: z.lazy(() => CartItemListRelationFilterSchema).optional(),
  promoCode: z.union([ z.lazy(() => PromoCodeNullableScalarRelationFilterSchema),z.lazy(() => PromoCodeWhereInputSchema) ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserNullableScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
}).strict());

export const CartOrderByWithAggregationInputSchema: z.ZodType<Prisma.CartOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  promoCodeId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => CartCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CartMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CartMinOrderByAggregateInputSchema).optional()
}).strict();

export const CartScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CartScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => CartScalarWhereWithAggregatesInputSchema),z.lazy(() => CartScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CartScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CartScalarWhereWithAggregatesInputSchema),z.lazy(() => CartScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  promoCodeId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const CartItemWhereInputSchema: z.ZodType<Prisma.CartItemWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CartItemWhereInputSchema),z.lazy(() => CartItemWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CartItemWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CartItemWhereInputSchema),z.lazy(() => CartItemWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  productId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  quantity: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  cartId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  product: z.union([ z.lazy(() => ProductScalarRelationFilterSchema),z.lazy(() => ProductWhereInputSchema) ]).optional(),
  cart: z.union([ z.lazy(() => CartScalarRelationFilterSchema),z.lazy(() => CartWhereInputSchema) ]).optional(),
}).strict();

export const CartItemOrderByWithRelationInputSchema: z.ZodType<Prisma.CartItemOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  cartId: z.lazy(() => SortOrderSchema).optional(),
  product: z.lazy(() => ProductOrderByWithRelationInputSchema).optional(),
  cart: z.lazy(() => CartOrderByWithRelationInputSchema).optional()
}).strict();

export const CartItemWhereUniqueInputSchema: z.ZodType<Prisma.CartItemWhereUniqueInput> = z.object({
  id: z.string().uuid()
})
.and(z.object({
  id: z.string().uuid().optional(),
  AND: z.union([ z.lazy(() => CartItemWhereInputSchema),z.lazy(() => CartItemWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CartItemWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CartItemWhereInputSchema),z.lazy(() => CartItemWhereInputSchema).array() ]).optional(),
  productId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  quantity: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  cartId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  product: z.union([ z.lazy(() => ProductScalarRelationFilterSchema),z.lazy(() => ProductWhereInputSchema) ]).optional(),
  cart: z.union([ z.lazy(() => CartScalarRelationFilterSchema),z.lazy(() => CartWhereInputSchema) ]).optional(),
}).strict());

export const CartItemOrderByWithAggregationInputSchema: z.ZodType<Prisma.CartItemOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  cartId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => CartItemCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => CartItemAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CartItemMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CartItemMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => CartItemSumOrderByAggregateInputSchema).optional()
}).strict();

export const CartItemScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CartItemScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => CartItemScalarWhereWithAggregatesInputSchema),z.lazy(() => CartItemScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CartItemScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CartItemScalarWhereWithAggregatesInputSchema),z.lazy(() => CartItemScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  productId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  quantity: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  cartId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const CategoryWhereInputSchema: z.ZodType<Prisma.CategoryWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CategoryWhereInputSchema),z.lazy(() => CategoryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CategoryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CategoryWhereInputSchema),z.lazy(() => CategoryWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  products: z.lazy(() => ProductListRelationFilterSchema).optional(),
  search: z.lazy(() => SearchListRelationFilterSchema).optional()
}).strict();

export const CategoryOrderByWithRelationInputSchema: z.ZodType<Prisma.CategoryOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  products: z.lazy(() => ProductOrderByRelationAggregateInputSchema).optional(),
  search: z.lazy(() => searchOrderByRelationAggregateInputSchema).optional()
}).strict();

export const CategoryWhereUniqueInputSchema: z.ZodType<Prisma.CategoryWhereUniqueInput> = z.object({
  id: z.string().uuid()
})
.and(z.object({
  id: z.string().uuid().optional(),
  AND: z.union([ z.lazy(() => CategoryWhereInputSchema),z.lazy(() => CategoryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CategoryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CategoryWhereInputSchema),z.lazy(() => CategoryWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  products: z.lazy(() => ProductListRelationFilterSchema).optional(),
  search: z.lazy(() => SearchListRelationFilterSchema).optional()
}).strict());

export const CategoryOrderByWithAggregationInputSchema: z.ZodType<Prisma.CategoryOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => CategoryCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CategoryMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CategoryMinOrderByAggregateInputSchema).optional()
}).strict();

export const CategoryScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CategoryScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema),z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema),z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const OrderWhereInputSchema: z.ZodType<Prisma.OrderWhereInput> = z.object({
  AND: z.union([ z.lazy(() => OrderWhereInputSchema),z.lazy(() => OrderWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrderWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrderWhereInputSchema),z.lazy(() => OrderWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  transporterId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  promoCodeId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  totalCents: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  currency: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  paymentMethod: z.union([ z.lazy(() => EnumPaymentMethodFilterSchema),z.lazy(() => PaymentMethodSchema) ]).optional(),
  deliveryNeeded: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  status: z.union([ z.lazy(() => EnumOrderStatusFilterSchema),z.lazy(() => OrderStatusSchema) ]).optional(),
  PaymobOrderId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  deliveryAddressId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  deliveredAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  transporter: z.union([ z.lazy(() => UserNullableScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
  orderItems: z.lazy(() => OrderItemListRelationFilterSchema).optional(),
  promoCode: z.union([ z.lazy(() => PromoCodeNullableScalarRelationFilterSchema),z.lazy(() => PromoCodeWhereInputSchema) ]).optional().nullable(),
  deliveryAddress: z.union([ z.lazy(() => AddressScalarRelationFilterSchema),z.lazy(() => AddressWhereInputSchema) ]).optional(),
}).strict();

export const OrderOrderByWithRelationInputSchema: z.ZodType<Prisma.OrderOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  transporterId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  promoCodeId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  totalCents: z.lazy(() => SortOrderSchema).optional(),
  currency: z.lazy(() => SortOrderSchema).optional(),
  paymentMethod: z.lazy(() => SortOrderSchema).optional(),
  deliveryNeeded: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  PaymobOrderId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deliveryAddressId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deliveredAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deleted: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  transporter: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  orderItems: z.lazy(() => OrderItemOrderByRelationAggregateInputSchema).optional(),
  promoCode: z.lazy(() => PromoCodeOrderByWithRelationInputSchema).optional(),
  deliveryAddress: z.lazy(() => AddressOrderByWithRelationInputSchema).optional()
}).strict();

export const OrderWhereUniqueInputSchema: z.ZodType<Prisma.OrderWhereUniqueInput> = z.object({
  id: z.string().uuid()
})
.and(z.object({
  id: z.string().uuid().optional(),
  AND: z.union([ z.lazy(() => OrderWhereInputSchema),z.lazy(() => OrderWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrderWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrderWhereInputSchema),z.lazy(() => OrderWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  transporterId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  promoCodeId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  totalCents: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  currency: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  paymentMethod: z.union([ z.lazy(() => EnumPaymentMethodFilterSchema),z.lazy(() => PaymentMethodSchema) ]).optional(),
  deliveryNeeded: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  status: z.union([ z.lazy(() => EnumOrderStatusFilterSchema),z.lazy(() => OrderStatusSchema) ]).optional(),
  PaymobOrderId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  deliveryAddressId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  deliveredAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  transporter: z.union([ z.lazy(() => UserNullableScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
  orderItems: z.lazy(() => OrderItemListRelationFilterSchema).optional(),
  promoCode: z.union([ z.lazy(() => PromoCodeNullableScalarRelationFilterSchema),z.lazy(() => PromoCodeWhereInputSchema) ]).optional().nullable(),
  deliveryAddress: z.union([ z.lazy(() => AddressScalarRelationFilterSchema),z.lazy(() => AddressWhereInputSchema) ]).optional(),
}).strict());

export const OrderOrderByWithAggregationInputSchema: z.ZodType<Prisma.OrderOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  transporterId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  promoCodeId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  totalCents: z.lazy(() => SortOrderSchema).optional(),
  currency: z.lazy(() => SortOrderSchema).optional(),
  paymentMethod: z.lazy(() => SortOrderSchema).optional(),
  deliveryNeeded: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  PaymobOrderId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deliveryAddressId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deliveredAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deleted: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => OrderCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => OrderAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => OrderMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => OrderMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => OrderSumOrderByAggregateInputSchema).optional()
}).strict();

export const OrderScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.OrderScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => OrderScalarWhereWithAggregatesInputSchema),z.lazy(() => OrderScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrderScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrderScalarWhereWithAggregatesInputSchema),z.lazy(() => OrderScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  transporterId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  promoCodeId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  totalCents: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  currency: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  paymentMethod: z.union([ z.lazy(() => EnumPaymentMethodWithAggregatesFilterSchema),z.lazy(() => PaymentMethodSchema) ]).optional(),
  deliveryNeeded: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  status: z.union([ z.lazy(() => EnumOrderStatusWithAggregatesFilterSchema),z.lazy(() => OrderStatusSchema) ]).optional(),
  PaymobOrderId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  deliveryAddressId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  deliveredAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  deleted: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const OrderItemWhereInputSchema: z.ZodType<Prisma.OrderItemWhereInput> = z.object({
  AND: z.union([ z.lazy(() => OrderItemWhereInputSchema),z.lazy(() => OrderItemWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrderItemWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrderItemWhereInputSchema),z.lazy(() => OrderItemWhereInputSchema).array() ]).optional(),
  orderId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  productId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  productPriceCents: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  productSalePercent: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  quantity: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  warrantyDays: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  order: z.union([ z.lazy(() => OrderScalarRelationFilterSchema),z.lazy(() => OrderWhereInputSchema) ]).optional(),
  product: z.union([ z.lazy(() => ProductScalarRelationFilterSchema),z.lazy(() => ProductWhereInputSchema) ]).optional(),
}).strict();

export const OrderItemOrderByWithRelationInputSchema: z.ZodType<Prisma.OrderItemOrderByWithRelationInput> = z.object({
  orderId: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
  productPriceCents: z.lazy(() => SortOrderSchema).optional(),
  productSalePercent: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  warrantyDays: z.lazy(() => SortOrderSchema).optional(),
  order: z.lazy(() => OrderOrderByWithRelationInputSchema).optional(),
  product: z.lazy(() => ProductOrderByWithRelationInputSchema).optional()
}).strict();

export const OrderItemWhereUniqueInputSchema: z.ZodType<Prisma.OrderItemWhereUniqueInput> = z.object({
  orderId_productId: z.lazy(() => OrderItemOrderIdProductIdCompoundUniqueInputSchema)
})
.and(z.object({
  orderId_productId: z.lazy(() => OrderItemOrderIdProductIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => OrderItemWhereInputSchema),z.lazy(() => OrderItemWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrderItemWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrderItemWhereInputSchema),z.lazy(() => OrderItemWhereInputSchema).array() ]).optional(),
  orderId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  productId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  productPriceCents: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  productSalePercent: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  quantity: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  warrantyDays: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  order: z.union([ z.lazy(() => OrderScalarRelationFilterSchema),z.lazy(() => OrderWhereInputSchema) ]).optional(),
  product: z.union([ z.lazy(() => ProductScalarRelationFilterSchema),z.lazy(() => ProductWhereInputSchema) ]).optional(),
}).strict());

export const OrderItemOrderByWithAggregationInputSchema: z.ZodType<Prisma.OrderItemOrderByWithAggregationInput> = z.object({
  orderId: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
  productPriceCents: z.lazy(() => SortOrderSchema).optional(),
  productSalePercent: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  warrantyDays: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => OrderItemCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => OrderItemAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => OrderItemMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => OrderItemMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => OrderItemSumOrderByAggregateInputSchema).optional()
}).strict();

export const OrderItemScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.OrderItemScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => OrderItemScalarWhereWithAggregatesInputSchema),z.lazy(() => OrderItemScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrderItemScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrderItemScalarWhereWithAggregatesInputSchema),z.lazy(() => OrderItemScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  orderId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  productId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  productPriceCents: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  productSalePercent: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  quantity: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  warrantyDays: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const ProductWhereInputSchema: z.ZodType<Prisma.ProductWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProductWhereInputSchema),z.lazy(() => ProductWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProductWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProductWhereInputSchema),z.lazy(() => ProductWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  sku: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  stock: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  views: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  priceCents: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  salePercent: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  warrantyDays: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  categoryId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  deleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  reviews: z.lazy(() => ReviewListRelationFilterSchema).optional(),
  category: z.union([ z.lazy(() => CategoryScalarRelationFilterSchema),z.lazy(() => CategoryWhereInputSchema) ]).optional(),
  wishers: z.lazy(() => UserListRelationFilterSchema).optional(),
  CartItem: z.lazy(() => CartItemListRelationFilterSchema).optional(),
  OrderItem: z.lazy(() => OrderItemListRelationFilterSchema).optional()
}).strict();

export const ProductOrderByWithRelationInputSchema: z.ZodType<Prisma.ProductOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  sku: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  stock: z.lazy(() => SortOrderSchema).optional(),
  views: z.lazy(() => SortOrderSchema).optional(),
  priceCents: z.lazy(() => SortOrderSchema).optional(),
  salePercent: z.lazy(() => SortOrderSchema).optional(),
  warrantyDays: z.lazy(() => SortOrderSchema).optional(),
  categoryId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deleted: z.lazy(() => SortOrderSchema).optional(),
  reviews: z.lazy(() => ReviewOrderByRelationAggregateInputSchema).optional(),
  category: z.lazy(() => CategoryOrderByWithRelationInputSchema).optional(),
  wishers: z.lazy(() => UserOrderByRelationAggregateInputSchema).optional(),
  CartItem: z.lazy(() => CartItemOrderByRelationAggregateInputSchema).optional(),
  OrderItem: z.lazy(() => OrderItemOrderByRelationAggregateInputSchema).optional()
}).strict();

export const ProductWhereUniqueInputSchema: z.ZodType<Prisma.ProductWhereUniqueInput> = z.object({
  id: z.string().uuid()
})
.and(z.object({
  id: z.string().uuid().optional(),
  AND: z.union([ z.lazy(() => ProductWhereInputSchema),z.lazy(() => ProductWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProductWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProductWhereInputSchema),z.lazy(() => ProductWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  sku: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  stock: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  views: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  priceCents: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  salePercent: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  warrantyDays: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  categoryId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  deleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  reviews: z.lazy(() => ReviewListRelationFilterSchema).optional(),
  category: z.union([ z.lazy(() => CategoryScalarRelationFilterSchema),z.lazy(() => CategoryWhereInputSchema) ]).optional(),
  wishers: z.lazy(() => UserListRelationFilterSchema).optional(),
  CartItem: z.lazy(() => CartItemListRelationFilterSchema).optional(),
  OrderItem: z.lazy(() => OrderItemListRelationFilterSchema).optional()
}).strict());

export const ProductOrderByWithAggregationInputSchema: z.ZodType<Prisma.ProductOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  sku: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  stock: z.lazy(() => SortOrderSchema).optional(),
  views: z.lazy(() => SortOrderSchema).optional(),
  priceCents: z.lazy(() => SortOrderSchema).optional(),
  salePercent: z.lazy(() => SortOrderSchema).optional(),
  warrantyDays: z.lazy(() => SortOrderSchema).optional(),
  categoryId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deleted: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ProductCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ProductAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ProductMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ProductMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ProductSumOrderByAggregateInputSchema).optional()
}).strict();

export const ProductScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ProductScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ProductScalarWhereWithAggregatesInputSchema),z.lazy(() => ProductScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProductScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProductScalarWhereWithAggregatesInputSchema),z.lazy(() => ProductScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  sku: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  stock: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  views: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  priceCents: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  salePercent: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  warrantyDays: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  categoryId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  deleted: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
}).strict();

export const PromoCodeWhereInputSchema: z.ZodType<Prisma.PromoCodeWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PromoCodeWhereInputSchema),z.lazy(() => PromoCodeWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PromoCodeWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PromoCodeWhereInputSchema),z.lazy(() => PromoCodeWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  code: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  discountPercent: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  maxDiscountCents: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  validFrom: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  validUntil: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  cart: z.lazy(() => CartListRelationFilterSchema).optional(),
  Order: z.lazy(() => OrderListRelationFilterSchema).optional()
}).strict();

export const PromoCodeOrderByWithRelationInputSchema: z.ZodType<Prisma.PromoCodeOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  code: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  discountPercent: z.lazy(() => SortOrderSchema).optional(),
  maxDiscountCents: z.lazy(() => SortOrderSchema).optional(),
  validFrom: z.lazy(() => SortOrderSchema).optional(),
  validUntil: z.lazy(() => SortOrderSchema).optional(),
  cart: z.lazy(() => CartOrderByRelationAggregateInputSchema).optional(),
  Order: z.lazy(() => OrderOrderByRelationAggregateInputSchema).optional()
}).strict();

export const PromoCodeWhereUniqueInputSchema: z.ZodType<Prisma.PromoCodeWhereUniqueInput> = z.object({
  id: z.string().uuid()
})
.and(z.object({
  id: z.string().uuid().optional(),
  AND: z.union([ z.lazy(() => PromoCodeWhereInputSchema),z.lazy(() => PromoCodeWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PromoCodeWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PromoCodeWhereInputSchema),z.lazy(() => PromoCodeWhereInputSchema).array() ]).optional(),
  code: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  discountPercent: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  maxDiscountCents: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  validFrom: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  validUntil: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  cart: z.lazy(() => CartListRelationFilterSchema).optional(),
  Order: z.lazy(() => OrderListRelationFilterSchema).optional()
}).strict());

export const PromoCodeOrderByWithAggregationInputSchema: z.ZodType<Prisma.PromoCodeOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  code: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  discountPercent: z.lazy(() => SortOrderSchema).optional(),
  maxDiscountCents: z.lazy(() => SortOrderSchema).optional(),
  validFrom: z.lazy(() => SortOrderSchema).optional(),
  validUntil: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PromoCodeCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => PromoCodeAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PromoCodeMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PromoCodeMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => PromoCodeSumOrderByAggregateInputSchema).optional()
}).strict();

export const PromoCodeScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PromoCodeScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PromoCodeScalarWhereWithAggregatesInputSchema),z.lazy(() => PromoCodeScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PromoCodeScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PromoCodeScalarWhereWithAggregatesInputSchema),z.lazy(() => PromoCodeScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  code: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  discountPercent: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  maxDiscountCents: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  validFrom: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  validUntil: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ReturnWhereInputSchema: z.ZodType<Prisma.ReturnWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ReturnWhereInputSchema),z.lazy(() => ReturnWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ReturnWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ReturnWhereInputSchema),z.lazy(() => ReturnWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  reason: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  transporterId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  deleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  User: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  transporter: z.union([ z.lazy(() => UserNullableScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
}).strict();

export const ReturnOrderByWithRelationInputSchema: z.ZodType<Prisma.ReturnOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  reason: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  transporterId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deleted: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  User: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  transporter: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const ReturnWhereUniqueInputSchema: z.ZodType<Prisma.ReturnWhereUniqueInput> = z.object({
  id: z.string().uuid()
})
.and(z.object({
  id: z.string().uuid().optional(),
  AND: z.union([ z.lazy(() => ReturnWhereInputSchema),z.lazy(() => ReturnWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ReturnWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ReturnWhereInputSchema),z.lazy(() => ReturnWhereInputSchema).array() ]).optional(),
  reason: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  transporterId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  deleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  User: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  transporter: z.union([ z.lazy(() => UserNullableScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
}).strict());

export const ReturnOrderByWithAggregationInputSchema: z.ZodType<Prisma.ReturnOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  reason: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  transporterId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deleted: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => ReturnCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ReturnMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ReturnMinOrderByAggregateInputSchema).optional()
}).strict();

export const ReturnScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ReturnScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ReturnScalarWhereWithAggregatesInputSchema),z.lazy(() => ReturnScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ReturnScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ReturnScalarWhereWithAggregatesInputSchema),z.lazy(() => ReturnScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  reason: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  transporterId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  deleted: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const ReviewWhereInputSchema: z.ZodType<Prisma.ReviewWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ReviewWhereInputSchema),z.lazy(() => ReviewWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ReviewWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ReviewWhereInputSchema),z.lazy(() => ReviewWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  productId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  rating: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  comment: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  deleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  product: z.union([ z.lazy(() => ProductScalarRelationFilterSchema),z.lazy(() => ProductWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const ReviewOrderByWithRelationInputSchema: z.ZodType<Prisma.ReviewOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  rating: z.lazy(() => SortOrderSchema).optional(),
  comment: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deleted: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  product: z.lazy(() => ProductOrderByWithRelationInputSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const ReviewWhereUniqueInputSchema: z.ZodType<Prisma.ReviewWhereUniqueInput> = z.object({
  id: z.string().uuid()
})
.and(z.object({
  id: z.string().uuid().optional(),
  AND: z.union([ z.lazy(() => ReviewWhereInputSchema),z.lazy(() => ReviewWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ReviewWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ReviewWhereInputSchema),z.lazy(() => ReviewWhereInputSchema).array() ]).optional(),
  productId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  rating: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  comment: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  deleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  product: z.union([ z.lazy(() => ProductScalarRelationFilterSchema),z.lazy(() => ProductWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const ReviewOrderByWithAggregationInputSchema: z.ZodType<Prisma.ReviewOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  rating: z.lazy(() => SortOrderSchema).optional(),
  comment: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deleted: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => ReviewCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ReviewAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ReviewMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ReviewMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ReviewSumOrderByAggregateInputSchema).optional()
}).strict();

export const ReviewScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ReviewScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ReviewScalarWhereWithAggregatesInputSchema),z.lazy(() => ReviewScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ReviewScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ReviewScalarWhereWithAggregatesInputSchema),z.lazy(() => ReviewScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  productId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  rating: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  comment: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  deleted: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const searchWhereInputSchema: z.ZodType<Prisma.searchWhereInput> = z.object({
  AND: z.union([ z.lazy(() => searchWhereInputSchema),z.lazy(() => searchWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => searchWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => searchWhereInputSchema),z.lazy(() => searchWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  keyWord: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  categoryId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  user: z.union([ z.lazy(() => UserNullableScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
  category: z.union([ z.lazy(() => CategoryScalarRelationFilterSchema),z.lazy(() => CategoryWhereInputSchema) ]).optional(),
}).strict();

export const searchOrderByWithRelationInputSchema: z.ZodType<Prisma.searchOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  keyWord: z.lazy(() => SortOrderSchema).optional(),
  userId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  categoryId: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  category: z.lazy(() => CategoryOrderByWithRelationInputSchema).optional()
}).strict();

export const searchWhereUniqueInputSchema: z.ZodType<Prisma.searchWhereUniqueInput> = z.object({
  id: z.string().uuid()
})
.and(z.object({
  id: z.string().uuid().optional(),
  AND: z.union([ z.lazy(() => searchWhereInputSchema),z.lazy(() => searchWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => searchWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => searchWhereInputSchema),z.lazy(() => searchWhereInputSchema).array() ]).optional(),
  keyWord: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  categoryId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  user: z.union([ z.lazy(() => UserNullableScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
  category: z.union([ z.lazy(() => CategoryScalarRelationFilterSchema),z.lazy(() => CategoryWhereInputSchema) ]).optional(),
}).strict());

export const searchOrderByWithAggregationInputSchema: z.ZodType<Prisma.searchOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  keyWord: z.lazy(() => SortOrderSchema).optional(),
  userId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  categoryId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => searchCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => searchMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => searchMinOrderByAggregateInputSchema).optional()
}).strict();

export const searchScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.searchScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => searchScalarWhereWithAggregatesInputSchema),z.lazy(() => searchScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => searchScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => searchScalarWhereWithAggregatesInputSchema),z.lazy(() => searchScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  keyWord: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  categoryId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  emailVerified: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  passwordHash: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  gender: z.union([ z.lazy(() => EnumGenderFilterSchema),z.lazy(() => GenderSchema) ]).optional(),
  dob: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  phone: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  phoneVerified: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  role: z.union([ z.lazy(() => EnumRoleFilterSchema),z.lazy(() => RoleSchema) ]).optional(),
  cartId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  deleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  cart: z.union([ z.lazy(() => CartScalarRelationFilterSchema),z.lazy(() => CartWhereInputSchema) ]).optional(),
  addresses: z.lazy(() => AddressListRelationFilterSchema).optional(),
  wishlist: z.lazy(() => ProductListRelationFilterSchema).optional(),
  orders: z.lazy(() => OrderListRelationFilterSchema).optional(),
  returns: z.lazy(() => ReturnListRelationFilterSchema).optional(),
  orderTranports: z.lazy(() => OrderListRelationFilterSchema).optional(),
  returnTransports: z.lazy(() => ReturnListRelationFilterSchema).optional(),
  Review: z.lazy(() => ReviewListRelationFilterSchema).optional(),
  search: z.lazy(() => SearchListRelationFilterSchema).optional()
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  passwordHash: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  gender: z.lazy(() => SortOrderSchema).optional(),
  dob: z.lazy(() => SortOrderSchema).optional(),
  phone: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  phoneVerified: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  cartId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deleted: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  cart: z.lazy(() => CartOrderByWithRelationInputSchema).optional(),
  addresses: z.lazy(() => AddressOrderByRelationAggregateInputSchema).optional(),
  wishlist: z.lazy(() => ProductOrderByRelationAggregateInputSchema).optional(),
  orders: z.lazy(() => OrderOrderByRelationAggregateInputSchema).optional(),
  returns: z.lazy(() => ReturnOrderByRelationAggregateInputSchema).optional(),
  orderTranports: z.lazy(() => OrderOrderByRelationAggregateInputSchema).optional(),
  returnTransports: z.lazy(() => ReturnOrderByRelationAggregateInputSchema).optional(),
  Review: z.lazy(() => ReviewOrderByRelationAggregateInputSchema).optional(),
  search: z.lazy(() => searchOrderByRelationAggregateInputSchema).optional()
}).strict();

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.string().uuid(),
    email: z.string(),
    cartId: z.string()
  }),
  z.object({
    id: z.string().uuid(),
    email: z.string(),
  }),
  z.object({
    id: z.string().uuid(),
    cartId: z.string(),
  }),
  z.object({
    id: z.string().uuid(),
  }),
  z.object({
    email: z.string(),
    cartId: z.string(),
  }),
  z.object({
    email: z.string(),
  }),
  z.object({
    cartId: z.string(),
  }),
])
.and(z.object({
  id: z.string().uuid().optional(),
  email: z.string().optional(),
  cartId: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  emailVerified: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  passwordHash: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  gender: z.union([ z.lazy(() => EnumGenderFilterSchema),z.lazy(() => GenderSchema) ]).optional(),
  dob: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  phone: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  phoneVerified: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  role: z.union([ z.lazy(() => EnumRoleFilterSchema),z.lazy(() => RoleSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  deleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  cart: z.union([ z.lazy(() => CartScalarRelationFilterSchema),z.lazy(() => CartWhereInputSchema) ]).optional(),
  addresses: z.lazy(() => AddressListRelationFilterSchema).optional(),
  wishlist: z.lazy(() => ProductListRelationFilterSchema).optional(),
  orders: z.lazy(() => OrderListRelationFilterSchema).optional(),
  returns: z.lazy(() => ReturnListRelationFilterSchema).optional(),
  orderTranports: z.lazy(() => OrderListRelationFilterSchema).optional(),
  returnTransports: z.lazy(() => ReturnListRelationFilterSchema).optional(),
  Review: z.lazy(() => ReviewListRelationFilterSchema).optional(),
  search: z.lazy(() => SearchListRelationFilterSchema).optional()
}).strict());

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  passwordHash: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  gender: z.lazy(() => SortOrderSchema).optional(),
  dob: z.lazy(() => SortOrderSchema).optional(),
  phone: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  phoneVerified: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  cartId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deleted: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional()
}).strict();

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  emailVerified: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  passwordHash: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  gender: z.union([ z.lazy(() => EnumGenderWithAggregatesFilterSchema),z.lazy(() => GenderSchema) ]).optional(),
  dob: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  phone: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  phoneVerified: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  role: z.union([ z.lazy(() => EnumRoleWithAggregatesFilterSchema),z.lazy(() => RoleSchema) ]).optional(),
  cartId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  deleted: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const AddressCreateInputSchema: z.ZodType<Prisma.AddressCreateInput> = z.object({
  id: z.string().uuid().optional(),
  apartment: z.string(),
  floor: z.string(),
  building: z.string(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  postalCode: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutAddressesInputSchema),
  Order: z.lazy(() => OrderCreateNestedManyWithoutDeliveryAddressInputSchema).optional()
}).strict();

export const AddressUncheckedCreateInputSchema: z.ZodType<Prisma.AddressUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  apartment: z.string(),
  floor: z.string(),
  building: z.string(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  postalCode: z.string(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  Order: z.lazy(() => OrderUncheckedCreateNestedManyWithoutDeliveryAddressInputSchema).optional()
}).strict();

export const AddressUpdateInputSchema: z.ZodType<Prisma.AddressUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  apartment: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  floor: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  building: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  postalCode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutAddressesNestedInputSchema).optional(),
  Order: z.lazy(() => OrderUpdateManyWithoutDeliveryAddressNestedInputSchema).optional()
}).strict();

export const AddressUncheckedUpdateInputSchema: z.ZodType<Prisma.AddressUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  apartment: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  floor: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  building: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  postalCode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  Order: z.lazy(() => OrderUncheckedUpdateManyWithoutDeliveryAddressNestedInputSchema).optional()
}).strict();

export const AddressCreateManyInputSchema: z.ZodType<Prisma.AddressCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  apartment: z.string(),
  floor: z.string(),
  building: z.string(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  postalCode: z.string(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const AddressUpdateManyMutationInputSchema: z.ZodType<Prisma.AddressUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  apartment: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  floor: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  building: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  postalCode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AddressUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AddressUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  apartment: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  floor: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  building: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  postalCode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const CartCreateInputSchema: z.ZodType<Prisma.CartCreateInput> = z.object({
  id: z.string().uuid().optional(),
  cartItems: z.lazy(() => CartItemCreateNestedManyWithoutCartInputSchema).optional(),
  promoCode: z.lazy(() => PromoCodeCreateNestedOneWithoutCartInputSchema).optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutCartInputSchema).optional()
}).strict();

export const CartUncheckedCreateInputSchema: z.ZodType<Prisma.CartUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  promoCodeId: z.string().optional().nullable(),
  cartItems: z.lazy(() => CartItemUncheckedCreateNestedManyWithoutCartInputSchema).optional(),
  user: z.lazy(() => UserUncheckedCreateNestedOneWithoutCartInputSchema).optional()
}).strict();

export const CartUpdateInputSchema: z.ZodType<Prisma.CartUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  cartItems: z.lazy(() => CartItemUpdateManyWithoutCartNestedInputSchema).optional(),
  promoCode: z.lazy(() => PromoCodeUpdateOneWithoutCartNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneWithoutCartNestedInputSchema).optional()
}).strict();

export const CartUncheckedUpdateInputSchema: z.ZodType<Prisma.CartUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promoCodeId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cartItems: z.lazy(() => CartItemUncheckedUpdateManyWithoutCartNestedInputSchema).optional(),
  user: z.lazy(() => UserUncheckedUpdateOneWithoutCartNestedInputSchema).optional()
}).strict();

export const CartCreateManyInputSchema: z.ZodType<Prisma.CartCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  promoCodeId: z.string().optional().nullable()
}).strict();

export const CartUpdateManyMutationInputSchema: z.ZodType<Prisma.CartUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CartUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CartUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promoCodeId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const CartItemCreateInputSchema: z.ZodType<Prisma.CartItemCreateInput> = z.object({
  id: z.string().uuid().optional(),
  quantity: z.number().int(),
  product: z.lazy(() => ProductCreateNestedOneWithoutCartItemInputSchema),
  cart: z.lazy(() => CartCreateNestedOneWithoutCartItemsInputSchema)
}).strict();

export const CartItemUncheckedCreateInputSchema: z.ZodType<Prisma.CartItemUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  productId: z.string(),
  quantity: z.number().int(),
  cartId: z.string()
}).strict();

export const CartItemUpdateInputSchema: z.ZodType<Prisma.CartItemUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  product: z.lazy(() => ProductUpdateOneRequiredWithoutCartItemNestedInputSchema).optional(),
  cart: z.lazy(() => CartUpdateOneRequiredWithoutCartItemsNestedInputSchema).optional()
}).strict();

export const CartItemUncheckedUpdateInputSchema: z.ZodType<Prisma.CartItemUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  productId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  cartId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CartItemCreateManyInputSchema: z.ZodType<Prisma.CartItemCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  productId: z.string(),
  quantity: z.number().int(),
  cartId: z.string()
}).strict();

export const CartItemUpdateManyMutationInputSchema: z.ZodType<Prisma.CartItemUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CartItemUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CartItemUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  productId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  cartId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CategoryCreateInputSchema: z.ZodType<Prisma.CategoryCreateInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  products: z.lazy(() => ProductCreateNestedManyWithoutCategoryInputSchema).optional(),
  search: z.lazy(() => searchCreateNestedManyWithoutCategoryInputSchema).optional()
}).strict();

export const CategoryUncheckedCreateInputSchema: z.ZodType<Prisma.CategoryUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  products: z.lazy(() => ProductUncheckedCreateNestedManyWithoutCategoryInputSchema).optional(),
  search: z.lazy(() => searchUncheckedCreateNestedManyWithoutCategoryInputSchema).optional()
}).strict();

export const CategoryUpdateInputSchema: z.ZodType<Prisma.CategoryUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  products: z.lazy(() => ProductUpdateManyWithoutCategoryNestedInputSchema).optional(),
  search: z.lazy(() => searchUpdateManyWithoutCategoryNestedInputSchema).optional()
}).strict();

export const CategoryUncheckedUpdateInputSchema: z.ZodType<Prisma.CategoryUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  products: z.lazy(() => ProductUncheckedUpdateManyWithoutCategoryNestedInputSchema).optional(),
  search: z.lazy(() => searchUncheckedUpdateManyWithoutCategoryNestedInputSchema).optional()
}).strict();

export const CategoryCreateManyInputSchema: z.ZodType<Prisma.CategoryCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string()
}).strict();

export const CategoryUpdateManyMutationInputSchema: z.ZodType<Prisma.CategoryUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CategoryUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CategoryUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrderCreateInputSchema: z.ZodType<Prisma.OrderCreateInput> = z.object({
  id: z.string().uuid().optional(),
  totalCents: z.number().int(),
  currency: z.string().optional(),
  paymentMethod: z.lazy(() => PaymentMethodSchema),
  deliveryNeeded: z.boolean(),
  status: z.lazy(() => OrderStatusSchema),
  PaymobOrderId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deliveredAt: z.coerce.date().optional().nullable(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutOrdersInputSchema),
  transporter: z.lazy(() => UserCreateNestedOneWithoutOrderTranportsInputSchema).optional(),
  orderItems: z.lazy(() => OrderItemCreateNestedManyWithoutOrderInputSchema).optional(),
  promoCode: z.lazy(() => PromoCodeCreateNestedOneWithoutOrderInputSchema).optional(),
  deliveryAddress: z.lazy(() => AddressCreateNestedOneWithoutOrderInputSchema)
}).strict();

export const OrderUncheckedCreateInputSchema: z.ZodType<Prisma.OrderUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  transporterId: z.string().optional().nullable(),
  promoCodeId: z.string().optional().nullable(),
  totalCents: z.number().int(),
  currency: z.string().optional(),
  paymentMethod: z.lazy(() => PaymentMethodSchema),
  deliveryNeeded: z.boolean(),
  status: z.lazy(() => OrderStatusSchema),
  PaymobOrderId: z.string().optional().nullable(),
  deliveryAddressId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deliveredAt: z.coerce.date().optional().nullable(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  orderItems: z.lazy(() => OrderItemUncheckedCreateNestedManyWithoutOrderInputSchema).optional()
}).strict();

export const OrderUpdateInputSchema: z.ZodType<Prisma.OrderUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  totalCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  paymentMethod: z.union([ z.lazy(() => PaymentMethodSchema),z.lazy(() => EnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional(),
  deliveryNeeded: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => OrderStatusSchema),z.lazy(() => EnumOrderStatusFieldUpdateOperationsInputSchema) ]).optional(),
  PaymobOrderId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deliveredAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutOrdersNestedInputSchema).optional(),
  transporter: z.lazy(() => UserUpdateOneWithoutOrderTranportsNestedInputSchema).optional(),
  orderItems: z.lazy(() => OrderItemUpdateManyWithoutOrderNestedInputSchema).optional(),
  promoCode: z.lazy(() => PromoCodeUpdateOneWithoutOrderNestedInputSchema).optional(),
  deliveryAddress: z.lazy(() => AddressUpdateOneRequiredWithoutOrderNestedInputSchema).optional()
}).strict();

export const OrderUncheckedUpdateInputSchema: z.ZodType<Prisma.OrderUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transporterId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  promoCodeId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  totalCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  paymentMethod: z.union([ z.lazy(() => PaymentMethodSchema),z.lazy(() => EnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional(),
  deliveryNeeded: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => OrderStatusSchema),z.lazy(() => EnumOrderStatusFieldUpdateOperationsInputSchema) ]).optional(),
  PaymobOrderId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deliveryAddressId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deliveredAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  orderItems: z.lazy(() => OrderItemUncheckedUpdateManyWithoutOrderNestedInputSchema).optional()
}).strict();

export const OrderCreateManyInputSchema: z.ZodType<Prisma.OrderCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  transporterId: z.string().optional().nullable(),
  promoCodeId: z.string().optional().nullable(),
  totalCents: z.number().int(),
  currency: z.string().optional(),
  paymentMethod: z.lazy(() => PaymentMethodSchema),
  deliveryNeeded: z.boolean(),
  status: z.lazy(() => OrderStatusSchema),
  PaymobOrderId: z.string().optional().nullable(),
  deliveryAddressId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deliveredAt: z.coerce.date().optional().nullable(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const OrderUpdateManyMutationInputSchema: z.ZodType<Prisma.OrderUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  totalCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  paymentMethod: z.union([ z.lazy(() => PaymentMethodSchema),z.lazy(() => EnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional(),
  deliveryNeeded: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => OrderStatusSchema),z.lazy(() => EnumOrderStatusFieldUpdateOperationsInputSchema) ]).optional(),
  PaymobOrderId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deliveredAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const OrderUncheckedUpdateManyInputSchema: z.ZodType<Prisma.OrderUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transporterId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  promoCodeId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  totalCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  paymentMethod: z.union([ z.lazy(() => PaymentMethodSchema),z.lazy(() => EnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional(),
  deliveryNeeded: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => OrderStatusSchema),z.lazy(() => EnumOrderStatusFieldUpdateOperationsInputSchema) ]).optional(),
  PaymobOrderId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deliveryAddressId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deliveredAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const OrderItemCreateInputSchema: z.ZodType<Prisma.OrderItemCreateInput> = z.object({
  productPriceCents: z.number().int(),
  productSalePercent: z.number().int(),
  quantity: z.number().int(),
  warrantyDays: z.number().int(),
  order: z.lazy(() => OrderCreateNestedOneWithoutOrderItemsInputSchema),
  product: z.lazy(() => ProductCreateNestedOneWithoutOrderItemInputSchema)
}).strict();

export const OrderItemUncheckedCreateInputSchema: z.ZodType<Prisma.OrderItemUncheckedCreateInput> = z.object({
  orderId: z.string(),
  productId: z.string(),
  productPriceCents: z.number().int(),
  productSalePercent: z.number().int(),
  quantity: z.number().int(),
  warrantyDays: z.number().int()
}).strict();

export const OrderItemUpdateInputSchema: z.ZodType<Prisma.OrderItemUpdateInput> = z.object({
  productPriceCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  productSalePercent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  warrantyDays: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  order: z.lazy(() => OrderUpdateOneRequiredWithoutOrderItemsNestedInputSchema).optional(),
  product: z.lazy(() => ProductUpdateOneRequiredWithoutOrderItemNestedInputSchema).optional()
}).strict();

export const OrderItemUncheckedUpdateInputSchema: z.ZodType<Prisma.OrderItemUncheckedUpdateInput> = z.object({
  orderId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  productId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  productPriceCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  productSalePercent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  warrantyDays: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrderItemCreateManyInputSchema: z.ZodType<Prisma.OrderItemCreateManyInput> = z.object({
  orderId: z.string(),
  productId: z.string(),
  productPriceCents: z.number().int(),
  productSalePercent: z.number().int(),
  quantity: z.number().int(),
  warrantyDays: z.number().int()
}).strict();

export const OrderItemUpdateManyMutationInputSchema: z.ZodType<Prisma.OrderItemUpdateManyMutationInput> = z.object({
  productPriceCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  productSalePercent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  warrantyDays: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrderItemUncheckedUpdateManyInputSchema: z.ZodType<Prisma.OrderItemUncheckedUpdateManyInput> = z.object({
  orderId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  productId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  productPriceCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  productSalePercent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  warrantyDays: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProductCreateInputSchema: z.ZodType<Prisma.ProductCreateInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  sku: z.string(),
  description: z.string(),
  stock: z.number().int().optional(),
  views: z.number().int().optional(),
  priceCents: z.number().int().optional(),
  salePercent: z.number().int().optional(),
  warrantyDays: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  reviews: z.lazy(() => ReviewCreateNestedManyWithoutProductInputSchema).optional(),
  category: z.lazy(() => CategoryCreateNestedOneWithoutProductsInputSchema),
  wishers: z.lazy(() => UserCreateNestedManyWithoutWishlistInputSchema).optional(),
  CartItem: z.lazy(() => CartItemCreateNestedManyWithoutProductInputSchema).optional(),
  OrderItem: z.lazy(() => OrderItemCreateNestedManyWithoutProductInputSchema).optional()
}).strict();

export const ProductUncheckedCreateInputSchema: z.ZodType<Prisma.ProductUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  sku: z.string(),
  description: z.string(),
  stock: z.number().int().optional(),
  views: z.number().int().optional(),
  priceCents: z.number().int().optional(),
  salePercent: z.number().int().optional(),
  warrantyDays: z.number().int().optional(),
  categoryId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  reviews: z.lazy(() => ReviewUncheckedCreateNestedManyWithoutProductInputSchema).optional(),
  wishers: z.lazy(() => UserUncheckedCreateNestedManyWithoutWishlistInputSchema).optional(),
  CartItem: z.lazy(() => CartItemUncheckedCreateNestedManyWithoutProductInputSchema).optional(),
  OrderItem: z.lazy(() => OrderItemUncheckedCreateNestedManyWithoutProductInputSchema).optional()
}).strict();

export const ProductUpdateInputSchema: z.ZodType<Prisma.ProductUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sku: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stock: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  views: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  priceCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  salePercent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  warrantyDays: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  reviews: z.lazy(() => ReviewUpdateManyWithoutProductNestedInputSchema).optional(),
  category: z.lazy(() => CategoryUpdateOneRequiredWithoutProductsNestedInputSchema).optional(),
  wishers: z.lazy(() => UserUpdateManyWithoutWishlistNestedInputSchema).optional(),
  CartItem: z.lazy(() => CartItemUpdateManyWithoutProductNestedInputSchema).optional(),
  OrderItem: z.lazy(() => OrderItemUpdateManyWithoutProductNestedInputSchema).optional()
}).strict();

export const ProductUncheckedUpdateInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sku: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stock: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  views: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  priceCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  salePercent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  warrantyDays: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  categoryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  reviews: z.lazy(() => ReviewUncheckedUpdateManyWithoutProductNestedInputSchema).optional(),
  wishers: z.lazy(() => UserUncheckedUpdateManyWithoutWishlistNestedInputSchema).optional(),
  CartItem: z.lazy(() => CartItemUncheckedUpdateManyWithoutProductNestedInputSchema).optional(),
  OrderItem: z.lazy(() => OrderItemUncheckedUpdateManyWithoutProductNestedInputSchema).optional()
}).strict();

export const ProductCreateManyInputSchema: z.ZodType<Prisma.ProductCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  sku: z.string(),
  description: z.string(),
  stock: z.number().int().optional(),
  views: z.number().int().optional(),
  priceCents: z.number().int().optional(),
  salePercent: z.number().int().optional(),
  warrantyDays: z.number().int().optional(),
  categoryId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional()
}).strict();

export const ProductUpdateManyMutationInputSchema: z.ZodType<Prisma.ProductUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sku: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stock: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  views: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  priceCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  salePercent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  warrantyDays: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProductUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sku: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stock: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  views: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  priceCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  salePercent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  warrantyDays: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  categoryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PromoCodeCreateInputSchema: z.ZodType<Prisma.PromoCodeCreateInput> = z.object({
  id: z.string().uuid().optional(),
  code: z.string(),
  description: z.string(),
  discountPercent: z.number().int(),
  maxDiscountCents: z.number().int(),
  validFrom: z.coerce.date(),
  validUntil: z.coerce.date(),
  cart: z.lazy(() => CartCreateNestedManyWithoutPromoCodeInputSchema).optional(),
  Order: z.lazy(() => OrderCreateNestedManyWithoutPromoCodeInputSchema).optional()
}).strict();

export const PromoCodeUncheckedCreateInputSchema: z.ZodType<Prisma.PromoCodeUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  code: z.string(),
  description: z.string(),
  discountPercent: z.number().int(),
  maxDiscountCents: z.number().int(),
  validFrom: z.coerce.date(),
  validUntil: z.coerce.date(),
  cart: z.lazy(() => CartUncheckedCreateNestedManyWithoutPromoCodeInputSchema).optional(),
  Order: z.lazy(() => OrderUncheckedCreateNestedManyWithoutPromoCodeInputSchema).optional()
}).strict();

export const PromoCodeUpdateInputSchema: z.ZodType<Prisma.PromoCodeUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  discountPercent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  maxDiscountCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  validFrom: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  validUntil: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  cart: z.lazy(() => CartUpdateManyWithoutPromoCodeNestedInputSchema).optional(),
  Order: z.lazy(() => OrderUpdateManyWithoutPromoCodeNestedInputSchema).optional()
}).strict();

export const PromoCodeUncheckedUpdateInputSchema: z.ZodType<Prisma.PromoCodeUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  discountPercent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  maxDiscountCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  validFrom: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  validUntil: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  cart: z.lazy(() => CartUncheckedUpdateManyWithoutPromoCodeNestedInputSchema).optional(),
  Order: z.lazy(() => OrderUncheckedUpdateManyWithoutPromoCodeNestedInputSchema).optional()
}).strict();

export const PromoCodeCreateManyInputSchema: z.ZodType<Prisma.PromoCodeCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  code: z.string(),
  description: z.string(),
  discountPercent: z.number().int(),
  maxDiscountCents: z.number().int(),
  validFrom: z.coerce.date(),
  validUntil: z.coerce.date()
}).strict();

export const PromoCodeUpdateManyMutationInputSchema: z.ZodType<Prisma.PromoCodeUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  discountPercent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  maxDiscountCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  validFrom: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  validUntil: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PromoCodeUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PromoCodeUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  discountPercent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  maxDiscountCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  validFrom: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  validUntil: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ReturnCreateInputSchema: z.ZodType<Prisma.ReturnCreateInput> = z.object({
  id: z.string().uuid().optional(),
  reason: z.string(),
  status: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  User: z.lazy(() => UserCreateNestedOneWithoutReturnsInputSchema),
  transporter: z.lazy(() => UserCreateNestedOneWithoutReturnTransportsInputSchema).optional()
}).strict();

export const ReturnUncheckedCreateInputSchema: z.ZodType<Prisma.ReturnUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  reason: z.string(),
  status: z.string(),
  userId: z.string(),
  transporterId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const ReturnUpdateInputSchema: z.ZodType<Prisma.ReturnUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  reason: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  User: z.lazy(() => UserUpdateOneRequiredWithoutReturnsNestedInputSchema).optional(),
  transporter: z.lazy(() => UserUpdateOneWithoutReturnTransportsNestedInputSchema).optional()
}).strict();

export const ReturnUncheckedUpdateInputSchema: z.ZodType<Prisma.ReturnUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  reason: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transporterId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ReturnCreateManyInputSchema: z.ZodType<Prisma.ReturnCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  reason: z.string(),
  status: z.string(),
  userId: z.string(),
  transporterId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const ReturnUpdateManyMutationInputSchema: z.ZodType<Prisma.ReturnUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  reason: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ReturnUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ReturnUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  reason: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transporterId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ReviewCreateInputSchema: z.ZodType<Prisma.ReviewCreateInput> = z.object({
  id: z.string().uuid().optional(),
  rating: z.number().int(),
  comment: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  product: z.lazy(() => ProductCreateNestedOneWithoutReviewsInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutReviewInputSchema)
}).strict();

export const ReviewUncheckedCreateInputSchema: z.ZodType<Prisma.ReviewUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  productId: z.string(),
  userId: z.string(),
  rating: z.number().int(),
  comment: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const ReviewUpdateInputSchema: z.ZodType<Prisma.ReviewUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  comment: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  product: z.lazy(() => ProductUpdateOneRequiredWithoutReviewsNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutReviewNestedInputSchema).optional()
}).strict();

export const ReviewUncheckedUpdateInputSchema: z.ZodType<Prisma.ReviewUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  productId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  comment: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ReviewCreateManyInputSchema: z.ZodType<Prisma.ReviewCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  productId: z.string(),
  userId: z.string(),
  rating: z.number().int(),
  comment: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const ReviewUpdateManyMutationInputSchema: z.ZodType<Prisma.ReviewUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  comment: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ReviewUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ReviewUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  productId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  comment: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const searchCreateInputSchema: z.ZodType<Prisma.searchCreateInput> = z.object({
  id: z.string().uuid().optional(),
  keyWord: z.string(),
  user: z.lazy(() => UserCreateNestedOneWithoutSearchInputSchema).optional(),
  category: z.lazy(() => CategoryCreateNestedOneWithoutSearchInputSchema)
}).strict();

export const searchUncheckedCreateInputSchema: z.ZodType<Prisma.searchUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  keyWord: z.string(),
  userId: z.string().optional().nullable(),
  categoryId: z.string()
}).strict();

export const searchUpdateInputSchema: z.ZodType<Prisma.searchUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  keyWord: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneWithoutSearchNestedInputSchema).optional(),
  category: z.lazy(() => CategoryUpdateOneRequiredWithoutSearchNestedInputSchema).optional()
}).strict();

export const searchUncheckedUpdateInputSchema: z.ZodType<Prisma.searchUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  keyWord: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  categoryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const searchCreateManyInputSchema: z.ZodType<Prisma.searchCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  keyWord: z.string(),
  userId: z.string().optional().nullable(),
  categoryId: z.string()
}).strict();

export const searchUpdateManyMutationInputSchema: z.ZodType<Prisma.searchUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  keyWord: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const searchUncheckedUpdateManyInputSchema: z.ZodType<Prisma.searchUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  keyWord: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  categoryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  id: z.string().uuid().optional(),
  email: z.string(),
  emailVerified: z.boolean().optional(),
  passwordHash: z.string(),
  name: z.string(),
  gender: z.lazy(() => GenderSchema),
  dob: z.coerce.date(),
  phone: z.string().optional().nullable(),
  phoneVerified: z.boolean().optional(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  cart: z.lazy(() => CartCreateNestedOneWithoutUserInputSchema),
  addresses: z.lazy(() => AddressCreateNestedManyWithoutUserInputSchema).optional(),
  wishlist: z.lazy(() => ProductCreateNestedManyWithoutWishersInputSchema).optional(),
  orders: z.lazy(() => OrderCreateNestedManyWithoutUserInputSchema).optional(),
  returns: z.lazy(() => ReturnCreateNestedManyWithoutUserInputSchema).optional(),
  orderTranports: z.lazy(() => OrderCreateNestedManyWithoutTransporterInputSchema).optional(),
  returnTransports: z.lazy(() => ReturnCreateNestedManyWithoutTransporterInputSchema).optional(),
  Review: z.lazy(() => ReviewCreateNestedManyWithoutUserInputSchema).optional(),
  search: z.lazy(() => searchCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  email: z.string(),
  emailVerified: z.boolean().optional(),
  passwordHash: z.string(),
  name: z.string(),
  gender: z.lazy(() => GenderSchema),
  dob: z.coerce.date(),
  phone: z.string().optional().nullable(),
  phoneVerified: z.boolean().optional(),
  role: z.lazy(() => RoleSchema).optional(),
  cartId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  addresses: z.lazy(() => AddressUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  wishlist: z.lazy(() => ProductUncheckedCreateNestedManyWithoutWishersInputSchema).optional(),
  orders: z.lazy(() => OrderUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  returns: z.lazy(() => ReturnUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  orderTranports: z.lazy(() => OrderUncheckedCreateNestedManyWithoutTransporterInputSchema).optional(),
  returnTransports: z.lazy(() => ReturnUncheckedCreateNestedManyWithoutTransporterInputSchema).optional(),
  Review: z.lazy(() => ReviewUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  search: z.lazy(() => searchUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  passwordHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => GenderSchema),z.lazy(() => EnumGenderFieldUpdateOperationsInputSchema) ]).optional(),
  dob: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cart: z.lazy(() => CartUpdateOneRequiredWithoutUserNestedInputSchema).optional(),
  addresses: z.lazy(() => AddressUpdateManyWithoutUserNestedInputSchema).optional(),
  wishlist: z.lazy(() => ProductUpdateManyWithoutWishersNestedInputSchema).optional(),
  orders: z.lazy(() => OrderUpdateManyWithoutUserNestedInputSchema).optional(),
  returns: z.lazy(() => ReturnUpdateManyWithoutUserNestedInputSchema).optional(),
  orderTranports: z.lazy(() => OrderUpdateManyWithoutTransporterNestedInputSchema).optional(),
  returnTransports: z.lazy(() => ReturnUpdateManyWithoutTransporterNestedInputSchema).optional(),
  Review: z.lazy(() => ReviewUpdateManyWithoutUserNestedInputSchema).optional(),
  search: z.lazy(() => searchUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  passwordHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => GenderSchema),z.lazy(() => EnumGenderFieldUpdateOperationsInputSchema) ]).optional(),
  dob: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  cartId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  addresses: z.lazy(() => AddressUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  wishlist: z.lazy(() => ProductUncheckedUpdateManyWithoutWishersNestedInputSchema).optional(),
  orders: z.lazy(() => OrderUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  returns: z.lazy(() => ReturnUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  orderTranports: z.lazy(() => OrderUncheckedUpdateManyWithoutTransporterNestedInputSchema).optional(),
  returnTransports: z.lazy(() => ReturnUncheckedUpdateManyWithoutTransporterNestedInputSchema).optional(),
  Review: z.lazy(() => ReviewUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  search: z.lazy(() => searchUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  email: z.string(),
  emailVerified: z.boolean().optional(),
  passwordHash: z.string(),
  name: z.string(),
  gender: z.lazy(() => GenderSchema),
  dob: z.coerce.date(),
  phone: z.string().optional().nullable(),
  phoneVerified: z.boolean().optional(),
  role: z.lazy(() => RoleSchema).optional(),
  cartId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  passwordHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => GenderSchema),z.lazy(() => EnumGenderFieldUpdateOperationsInputSchema) ]).optional(),
  dob: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  passwordHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => GenderSchema),z.lazy(() => EnumGenderFieldUpdateOperationsInputSchema) ]).optional(),
  dob: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  cartId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const UserScalarRelationFilterSchema: z.ZodType<Prisma.UserScalarRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const OrderListRelationFilterSchema: z.ZodType<Prisma.OrderListRelationFilter> = z.object({
  every: z.lazy(() => OrderWhereInputSchema).optional(),
  some: z.lazy(() => OrderWhereInputSchema).optional(),
  none: z.lazy(() => OrderWhereInputSchema).optional()
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const OrderOrderByRelationAggregateInputSchema: z.ZodType<Prisma.OrderOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AddressCountOrderByAggregateInputSchema: z.ZodType<Prisma.AddressCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  apartment: z.lazy(() => SortOrderSchema).optional(),
  floor: z.lazy(() => SortOrderSchema).optional(),
  building: z.lazy(() => SortOrderSchema).optional(),
  street: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional(),
  postalCode: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deleted: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AddressMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AddressMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  apartment: z.lazy(() => SortOrderSchema).optional(),
  floor: z.lazy(() => SortOrderSchema).optional(),
  building: z.lazy(() => SortOrderSchema).optional(),
  street: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional(),
  postalCode: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deleted: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AddressMinOrderByAggregateInputSchema: z.ZodType<Prisma.AddressMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  apartment: z.lazy(() => SortOrderSchema).optional(),
  floor: z.lazy(() => SortOrderSchema).optional(),
  building: z.lazy(() => SortOrderSchema).optional(),
  street: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional(),
  postalCode: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deleted: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const CartItemListRelationFilterSchema: z.ZodType<Prisma.CartItemListRelationFilter> = z.object({
  every: z.lazy(() => CartItemWhereInputSchema).optional(),
  some: z.lazy(() => CartItemWhereInputSchema).optional(),
  none: z.lazy(() => CartItemWhereInputSchema).optional()
}).strict();

export const PromoCodeNullableScalarRelationFilterSchema: z.ZodType<Prisma.PromoCodeNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => PromoCodeWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => PromoCodeWhereInputSchema).optional().nullable()
}).strict();

export const UserNullableScalarRelationFilterSchema: z.ZodType<Prisma.UserNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => UserWhereInputSchema).optional().nullable()
}).strict();

export const CartItemOrderByRelationAggregateInputSchema: z.ZodType<Prisma.CartItemOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CartCountOrderByAggregateInputSchema: z.ZodType<Prisma.CartCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  promoCodeId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CartMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CartMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  promoCodeId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CartMinOrderByAggregateInputSchema: z.ZodType<Prisma.CartMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  promoCodeId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const ProductScalarRelationFilterSchema: z.ZodType<Prisma.ProductScalarRelationFilter> = z.object({
  is: z.lazy(() => ProductWhereInputSchema).optional(),
  isNot: z.lazy(() => ProductWhereInputSchema).optional()
}).strict();

export const CartScalarRelationFilterSchema: z.ZodType<Prisma.CartScalarRelationFilter> = z.object({
  is: z.lazy(() => CartWhereInputSchema).optional(),
  isNot: z.lazy(() => CartWhereInputSchema).optional()
}).strict();

export const CartItemCountOrderByAggregateInputSchema: z.ZodType<Prisma.CartItemCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  cartId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CartItemAvgOrderByAggregateInputSchema: z.ZodType<Prisma.CartItemAvgOrderByAggregateInput> = z.object({
  quantity: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CartItemMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CartItemMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  cartId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CartItemMinOrderByAggregateInputSchema: z.ZodType<Prisma.CartItemMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  cartId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CartItemSumOrderByAggregateInputSchema: z.ZodType<Prisma.CartItemSumOrderByAggregateInput> = z.object({
  quantity: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const ProductListRelationFilterSchema: z.ZodType<Prisma.ProductListRelationFilter> = z.object({
  every: z.lazy(() => ProductWhereInputSchema).optional(),
  some: z.lazy(() => ProductWhereInputSchema).optional(),
  none: z.lazy(() => ProductWhereInputSchema).optional()
}).strict();

export const SearchListRelationFilterSchema: z.ZodType<Prisma.SearchListRelationFilter> = z.object({
  every: z.lazy(() => searchWhereInputSchema).optional(),
  some: z.lazy(() => searchWhereInputSchema).optional(),
  none: z.lazy(() => searchWhereInputSchema).optional()
}).strict();

export const ProductOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ProductOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const searchOrderByRelationAggregateInputSchema: z.ZodType<Prisma.searchOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CategoryCountOrderByAggregateInputSchema: z.ZodType<Prisma.CategoryCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CategoryMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CategoryMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CategoryMinOrderByAggregateInputSchema: z.ZodType<Prisma.CategoryMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumPaymentMethodFilterSchema: z.ZodType<Prisma.EnumPaymentMethodFilter> = z.object({
  equals: z.lazy(() => PaymentMethodSchema).optional(),
  in: z.lazy(() => PaymentMethodSchema).array().optional(),
  notIn: z.lazy(() => PaymentMethodSchema).array().optional(),
  not: z.union([ z.lazy(() => PaymentMethodSchema),z.lazy(() => NestedEnumPaymentMethodFilterSchema) ]).optional(),
}).strict();

export const EnumOrderStatusFilterSchema: z.ZodType<Prisma.EnumOrderStatusFilter> = z.object({
  equals: z.lazy(() => OrderStatusSchema).optional(),
  in: z.lazy(() => OrderStatusSchema).array().optional(),
  notIn: z.lazy(() => OrderStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => OrderStatusSchema),z.lazy(() => NestedEnumOrderStatusFilterSchema) ]).optional(),
}).strict();

export const OrderItemListRelationFilterSchema: z.ZodType<Prisma.OrderItemListRelationFilter> = z.object({
  every: z.lazy(() => OrderItemWhereInputSchema).optional(),
  some: z.lazy(() => OrderItemWhereInputSchema).optional(),
  none: z.lazy(() => OrderItemWhereInputSchema).optional()
}).strict();

export const AddressScalarRelationFilterSchema: z.ZodType<Prisma.AddressScalarRelationFilter> = z.object({
  is: z.lazy(() => AddressWhereInputSchema).optional(),
  isNot: z.lazy(() => AddressWhereInputSchema).optional()
}).strict();

export const OrderItemOrderByRelationAggregateInputSchema: z.ZodType<Prisma.OrderItemOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrderCountOrderByAggregateInputSchema: z.ZodType<Prisma.OrderCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  transporterId: z.lazy(() => SortOrderSchema).optional(),
  promoCodeId: z.lazy(() => SortOrderSchema).optional(),
  totalCents: z.lazy(() => SortOrderSchema).optional(),
  currency: z.lazy(() => SortOrderSchema).optional(),
  paymentMethod: z.lazy(() => SortOrderSchema).optional(),
  deliveryNeeded: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  PaymobOrderId: z.lazy(() => SortOrderSchema).optional(),
  deliveryAddressId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deliveredAt: z.lazy(() => SortOrderSchema).optional(),
  deleted: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrderAvgOrderByAggregateInputSchema: z.ZodType<Prisma.OrderAvgOrderByAggregateInput> = z.object({
  totalCents: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrderMaxOrderByAggregateInputSchema: z.ZodType<Prisma.OrderMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  transporterId: z.lazy(() => SortOrderSchema).optional(),
  promoCodeId: z.lazy(() => SortOrderSchema).optional(),
  totalCents: z.lazy(() => SortOrderSchema).optional(),
  currency: z.lazy(() => SortOrderSchema).optional(),
  paymentMethod: z.lazy(() => SortOrderSchema).optional(),
  deliveryNeeded: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  PaymobOrderId: z.lazy(() => SortOrderSchema).optional(),
  deliveryAddressId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deliveredAt: z.lazy(() => SortOrderSchema).optional(),
  deleted: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrderMinOrderByAggregateInputSchema: z.ZodType<Prisma.OrderMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  transporterId: z.lazy(() => SortOrderSchema).optional(),
  promoCodeId: z.lazy(() => SortOrderSchema).optional(),
  totalCents: z.lazy(() => SortOrderSchema).optional(),
  currency: z.lazy(() => SortOrderSchema).optional(),
  paymentMethod: z.lazy(() => SortOrderSchema).optional(),
  deliveryNeeded: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  PaymobOrderId: z.lazy(() => SortOrderSchema).optional(),
  deliveryAddressId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deliveredAt: z.lazy(() => SortOrderSchema).optional(),
  deleted: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrderSumOrderByAggregateInputSchema: z.ZodType<Prisma.OrderSumOrderByAggregateInput> = z.object({
  totalCents: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumPaymentMethodWithAggregatesFilterSchema: z.ZodType<Prisma.EnumPaymentMethodWithAggregatesFilter> = z.object({
  equals: z.lazy(() => PaymentMethodSchema).optional(),
  in: z.lazy(() => PaymentMethodSchema).array().optional(),
  notIn: z.lazy(() => PaymentMethodSchema).array().optional(),
  not: z.union([ z.lazy(() => PaymentMethodSchema),z.lazy(() => NestedEnumPaymentMethodWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumPaymentMethodFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumPaymentMethodFilterSchema).optional()
}).strict();

export const EnumOrderStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumOrderStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => OrderStatusSchema).optional(),
  in: z.lazy(() => OrderStatusSchema).array().optional(),
  notIn: z.lazy(() => OrderStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => OrderStatusSchema),z.lazy(() => NestedEnumOrderStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumOrderStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumOrderStatusFilterSchema).optional()
}).strict();

export const OrderScalarRelationFilterSchema: z.ZodType<Prisma.OrderScalarRelationFilter> = z.object({
  is: z.lazy(() => OrderWhereInputSchema).optional(),
  isNot: z.lazy(() => OrderWhereInputSchema).optional()
}).strict();

export const OrderItemOrderIdProductIdCompoundUniqueInputSchema: z.ZodType<Prisma.OrderItemOrderIdProductIdCompoundUniqueInput> = z.object({
  orderId: z.string(),
  productId: z.string()
}).strict();

export const OrderItemCountOrderByAggregateInputSchema: z.ZodType<Prisma.OrderItemCountOrderByAggregateInput> = z.object({
  orderId: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
  productPriceCents: z.lazy(() => SortOrderSchema).optional(),
  productSalePercent: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  warrantyDays: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrderItemAvgOrderByAggregateInputSchema: z.ZodType<Prisma.OrderItemAvgOrderByAggregateInput> = z.object({
  productPriceCents: z.lazy(() => SortOrderSchema).optional(),
  productSalePercent: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  warrantyDays: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrderItemMaxOrderByAggregateInputSchema: z.ZodType<Prisma.OrderItemMaxOrderByAggregateInput> = z.object({
  orderId: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
  productPriceCents: z.lazy(() => SortOrderSchema).optional(),
  productSalePercent: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  warrantyDays: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrderItemMinOrderByAggregateInputSchema: z.ZodType<Prisma.OrderItemMinOrderByAggregateInput> = z.object({
  orderId: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
  productPriceCents: z.lazy(() => SortOrderSchema).optional(),
  productSalePercent: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  warrantyDays: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrderItemSumOrderByAggregateInputSchema: z.ZodType<Prisma.OrderItemSumOrderByAggregateInput> = z.object({
  productPriceCents: z.lazy(() => SortOrderSchema).optional(),
  productSalePercent: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  warrantyDays: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ReviewListRelationFilterSchema: z.ZodType<Prisma.ReviewListRelationFilter> = z.object({
  every: z.lazy(() => ReviewWhereInputSchema).optional(),
  some: z.lazy(() => ReviewWhereInputSchema).optional(),
  none: z.lazy(() => ReviewWhereInputSchema).optional()
}).strict();

export const CategoryScalarRelationFilterSchema: z.ZodType<Prisma.CategoryScalarRelationFilter> = z.object({
  is: z.lazy(() => CategoryWhereInputSchema).optional(),
  isNot: z.lazy(() => CategoryWhereInputSchema).optional()
}).strict();

export const UserListRelationFilterSchema: z.ZodType<Prisma.UserListRelationFilter> = z.object({
  every: z.lazy(() => UserWhereInputSchema).optional(),
  some: z.lazy(() => UserWhereInputSchema).optional(),
  none: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const ReviewOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ReviewOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserOrderByRelationAggregateInputSchema: z.ZodType<Prisma.UserOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProductCountOrderByAggregateInputSchema: z.ZodType<Prisma.ProductCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  sku: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  stock: z.lazy(() => SortOrderSchema).optional(),
  views: z.lazy(() => SortOrderSchema).optional(),
  priceCents: z.lazy(() => SortOrderSchema).optional(),
  salePercent: z.lazy(() => SortOrderSchema).optional(),
  warrantyDays: z.lazy(() => SortOrderSchema).optional(),
  categoryId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deleted: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProductAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ProductAvgOrderByAggregateInput> = z.object({
  stock: z.lazy(() => SortOrderSchema).optional(),
  views: z.lazy(() => SortOrderSchema).optional(),
  priceCents: z.lazy(() => SortOrderSchema).optional(),
  salePercent: z.lazy(() => SortOrderSchema).optional(),
  warrantyDays: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProductMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ProductMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  sku: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  stock: z.lazy(() => SortOrderSchema).optional(),
  views: z.lazy(() => SortOrderSchema).optional(),
  priceCents: z.lazy(() => SortOrderSchema).optional(),
  salePercent: z.lazy(() => SortOrderSchema).optional(),
  warrantyDays: z.lazy(() => SortOrderSchema).optional(),
  categoryId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deleted: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProductMinOrderByAggregateInputSchema: z.ZodType<Prisma.ProductMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  sku: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  stock: z.lazy(() => SortOrderSchema).optional(),
  views: z.lazy(() => SortOrderSchema).optional(),
  priceCents: z.lazy(() => SortOrderSchema).optional(),
  salePercent: z.lazy(() => SortOrderSchema).optional(),
  warrantyDays: z.lazy(() => SortOrderSchema).optional(),
  categoryId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deleted: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProductSumOrderByAggregateInputSchema: z.ZodType<Prisma.ProductSumOrderByAggregateInput> = z.object({
  stock: z.lazy(() => SortOrderSchema).optional(),
  views: z.lazy(() => SortOrderSchema).optional(),
  priceCents: z.lazy(() => SortOrderSchema).optional(),
  salePercent: z.lazy(() => SortOrderSchema).optional(),
  warrantyDays: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CartListRelationFilterSchema: z.ZodType<Prisma.CartListRelationFilter> = z.object({
  every: z.lazy(() => CartWhereInputSchema).optional(),
  some: z.lazy(() => CartWhereInputSchema).optional(),
  none: z.lazy(() => CartWhereInputSchema).optional()
}).strict();

export const CartOrderByRelationAggregateInputSchema: z.ZodType<Prisma.CartOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PromoCodeCountOrderByAggregateInputSchema: z.ZodType<Prisma.PromoCodeCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  code: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  discountPercent: z.lazy(() => SortOrderSchema).optional(),
  maxDiscountCents: z.lazy(() => SortOrderSchema).optional(),
  validFrom: z.lazy(() => SortOrderSchema).optional(),
  validUntil: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PromoCodeAvgOrderByAggregateInputSchema: z.ZodType<Prisma.PromoCodeAvgOrderByAggregateInput> = z.object({
  discountPercent: z.lazy(() => SortOrderSchema).optional(),
  maxDiscountCents: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PromoCodeMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PromoCodeMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  code: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  discountPercent: z.lazy(() => SortOrderSchema).optional(),
  maxDiscountCents: z.lazy(() => SortOrderSchema).optional(),
  validFrom: z.lazy(() => SortOrderSchema).optional(),
  validUntil: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PromoCodeMinOrderByAggregateInputSchema: z.ZodType<Prisma.PromoCodeMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  code: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  discountPercent: z.lazy(() => SortOrderSchema).optional(),
  maxDiscountCents: z.lazy(() => SortOrderSchema).optional(),
  validFrom: z.lazy(() => SortOrderSchema).optional(),
  validUntil: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PromoCodeSumOrderByAggregateInputSchema: z.ZodType<Prisma.PromoCodeSumOrderByAggregateInput> = z.object({
  discountPercent: z.lazy(() => SortOrderSchema).optional(),
  maxDiscountCents: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ReturnCountOrderByAggregateInputSchema: z.ZodType<Prisma.ReturnCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  reason: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  transporterId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deleted: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ReturnMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ReturnMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  reason: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  transporterId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deleted: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ReturnMinOrderByAggregateInputSchema: z.ZodType<Prisma.ReturnMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  reason: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  transporterId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deleted: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ReviewCountOrderByAggregateInputSchema: z.ZodType<Prisma.ReviewCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  rating: z.lazy(() => SortOrderSchema).optional(),
  comment: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deleted: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ReviewAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ReviewAvgOrderByAggregateInput> = z.object({
  rating: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ReviewMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ReviewMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  rating: z.lazy(() => SortOrderSchema).optional(),
  comment: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deleted: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ReviewMinOrderByAggregateInputSchema: z.ZodType<Prisma.ReviewMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  rating: z.lazy(() => SortOrderSchema).optional(),
  comment: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deleted: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ReviewSumOrderByAggregateInputSchema: z.ZodType<Prisma.ReviewSumOrderByAggregateInput> = z.object({
  rating: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const searchCountOrderByAggregateInputSchema: z.ZodType<Prisma.searchCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  keyWord: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  categoryId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const searchMaxOrderByAggregateInputSchema: z.ZodType<Prisma.searchMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  keyWord: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  categoryId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const searchMinOrderByAggregateInputSchema: z.ZodType<Prisma.searchMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  keyWord: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  categoryId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumGenderFilterSchema: z.ZodType<Prisma.EnumGenderFilter> = z.object({
  equals: z.lazy(() => GenderSchema).optional(),
  in: z.lazy(() => GenderSchema).array().optional(),
  notIn: z.lazy(() => GenderSchema).array().optional(),
  not: z.union([ z.lazy(() => GenderSchema),z.lazy(() => NestedEnumGenderFilterSchema) ]).optional(),
}).strict();

export const EnumRoleFilterSchema: z.ZodType<Prisma.EnumRoleFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NestedEnumRoleFilterSchema) ]).optional(),
}).strict();

export const AddressListRelationFilterSchema: z.ZodType<Prisma.AddressListRelationFilter> = z.object({
  every: z.lazy(() => AddressWhereInputSchema).optional(),
  some: z.lazy(() => AddressWhereInputSchema).optional(),
  none: z.lazy(() => AddressWhereInputSchema).optional()
}).strict();

export const ReturnListRelationFilterSchema: z.ZodType<Prisma.ReturnListRelationFilter> = z.object({
  every: z.lazy(() => ReturnWhereInputSchema).optional(),
  some: z.lazy(() => ReturnWhereInputSchema).optional(),
  none: z.lazy(() => ReturnWhereInputSchema).optional()
}).strict();

export const AddressOrderByRelationAggregateInputSchema: z.ZodType<Prisma.AddressOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ReturnOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ReturnOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  passwordHash: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  gender: z.lazy(() => SortOrderSchema).optional(),
  dob: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  phoneVerified: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  cartId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deleted: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  passwordHash: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  gender: z.lazy(() => SortOrderSchema).optional(),
  dob: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  phoneVerified: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  cartId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deleted: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  passwordHash: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  gender: z.lazy(() => SortOrderSchema).optional(),
  dob: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  phoneVerified: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  cartId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deleted: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumGenderWithAggregatesFilterSchema: z.ZodType<Prisma.EnumGenderWithAggregatesFilter> = z.object({
  equals: z.lazy(() => GenderSchema).optional(),
  in: z.lazy(() => GenderSchema).array().optional(),
  notIn: z.lazy(() => GenderSchema).array().optional(),
  not: z.union([ z.lazy(() => GenderSchema),z.lazy(() => NestedEnumGenderWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumGenderFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumGenderFilterSchema).optional()
}).strict();

export const EnumRoleWithAggregatesFilterSchema: z.ZodType<Prisma.EnumRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NestedEnumRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRoleFilterSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutAddressesInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutAddressesInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutAddressesInputSchema),z.lazy(() => UserUncheckedCreateWithoutAddressesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAddressesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const OrderCreateNestedManyWithoutDeliveryAddressInputSchema: z.ZodType<Prisma.OrderCreateNestedManyWithoutDeliveryAddressInput> = z.object({
  create: z.union([ z.lazy(() => OrderCreateWithoutDeliveryAddressInputSchema),z.lazy(() => OrderCreateWithoutDeliveryAddressInputSchema).array(),z.lazy(() => OrderUncheckedCreateWithoutDeliveryAddressInputSchema),z.lazy(() => OrderUncheckedCreateWithoutDeliveryAddressInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderCreateOrConnectWithoutDeliveryAddressInputSchema),z.lazy(() => OrderCreateOrConnectWithoutDeliveryAddressInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderCreateManyDeliveryAddressInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OrderUncheckedCreateNestedManyWithoutDeliveryAddressInputSchema: z.ZodType<Prisma.OrderUncheckedCreateNestedManyWithoutDeliveryAddressInput> = z.object({
  create: z.union([ z.lazy(() => OrderCreateWithoutDeliveryAddressInputSchema),z.lazy(() => OrderCreateWithoutDeliveryAddressInputSchema).array(),z.lazy(() => OrderUncheckedCreateWithoutDeliveryAddressInputSchema),z.lazy(() => OrderUncheckedCreateWithoutDeliveryAddressInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderCreateOrConnectWithoutDeliveryAddressInputSchema),z.lazy(() => OrderCreateOrConnectWithoutDeliveryAddressInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderCreateManyDeliveryAddressInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional().nullable()
}).strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional()
}).strict();

export const UserUpdateOneRequiredWithoutAddressesNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutAddressesNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutAddressesInputSchema),z.lazy(() => UserUncheckedCreateWithoutAddressesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAddressesInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutAddressesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutAddressesInputSchema),z.lazy(() => UserUpdateWithoutAddressesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAddressesInputSchema) ]).optional(),
}).strict();

export const OrderUpdateManyWithoutDeliveryAddressNestedInputSchema: z.ZodType<Prisma.OrderUpdateManyWithoutDeliveryAddressNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrderCreateWithoutDeliveryAddressInputSchema),z.lazy(() => OrderCreateWithoutDeliveryAddressInputSchema).array(),z.lazy(() => OrderUncheckedCreateWithoutDeliveryAddressInputSchema),z.lazy(() => OrderUncheckedCreateWithoutDeliveryAddressInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderCreateOrConnectWithoutDeliveryAddressInputSchema),z.lazy(() => OrderCreateOrConnectWithoutDeliveryAddressInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrderUpsertWithWhereUniqueWithoutDeliveryAddressInputSchema),z.lazy(() => OrderUpsertWithWhereUniqueWithoutDeliveryAddressInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderCreateManyDeliveryAddressInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrderUpdateWithWhereUniqueWithoutDeliveryAddressInputSchema),z.lazy(() => OrderUpdateWithWhereUniqueWithoutDeliveryAddressInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrderUpdateManyWithWhereWithoutDeliveryAddressInputSchema),z.lazy(() => OrderUpdateManyWithWhereWithoutDeliveryAddressInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrderScalarWhereInputSchema),z.lazy(() => OrderScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OrderUncheckedUpdateManyWithoutDeliveryAddressNestedInputSchema: z.ZodType<Prisma.OrderUncheckedUpdateManyWithoutDeliveryAddressNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrderCreateWithoutDeliveryAddressInputSchema),z.lazy(() => OrderCreateWithoutDeliveryAddressInputSchema).array(),z.lazy(() => OrderUncheckedCreateWithoutDeliveryAddressInputSchema),z.lazy(() => OrderUncheckedCreateWithoutDeliveryAddressInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderCreateOrConnectWithoutDeliveryAddressInputSchema),z.lazy(() => OrderCreateOrConnectWithoutDeliveryAddressInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrderUpsertWithWhereUniqueWithoutDeliveryAddressInputSchema),z.lazy(() => OrderUpsertWithWhereUniqueWithoutDeliveryAddressInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderCreateManyDeliveryAddressInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrderUpdateWithWhereUniqueWithoutDeliveryAddressInputSchema),z.lazy(() => OrderUpdateWithWhereUniqueWithoutDeliveryAddressInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrderUpdateManyWithWhereWithoutDeliveryAddressInputSchema),z.lazy(() => OrderUpdateManyWithWhereWithoutDeliveryAddressInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrderScalarWhereInputSchema),z.lazy(() => OrderScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CartItemCreateNestedManyWithoutCartInputSchema: z.ZodType<Prisma.CartItemCreateNestedManyWithoutCartInput> = z.object({
  create: z.union([ z.lazy(() => CartItemCreateWithoutCartInputSchema),z.lazy(() => CartItemCreateWithoutCartInputSchema).array(),z.lazy(() => CartItemUncheckedCreateWithoutCartInputSchema),z.lazy(() => CartItemUncheckedCreateWithoutCartInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CartItemCreateOrConnectWithoutCartInputSchema),z.lazy(() => CartItemCreateOrConnectWithoutCartInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CartItemCreateManyCartInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CartItemWhereUniqueInputSchema),z.lazy(() => CartItemWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PromoCodeCreateNestedOneWithoutCartInputSchema: z.ZodType<Prisma.PromoCodeCreateNestedOneWithoutCartInput> = z.object({
  create: z.union([ z.lazy(() => PromoCodeCreateWithoutCartInputSchema),z.lazy(() => PromoCodeUncheckedCreateWithoutCartInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PromoCodeCreateOrConnectWithoutCartInputSchema).optional(),
  connect: z.lazy(() => PromoCodeWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutCartInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutCartInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutCartInputSchema),z.lazy(() => UserUncheckedCreateWithoutCartInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutCartInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const CartItemUncheckedCreateNestedManyWithoutCartInputSchema: z.ZodType<Prisma.CartItemUncheckedCreateNestedManyWithoutCartInput> = z.object({
  create: z.union([ z.lazy(() => CartItemCreateWithoutCartInputSchema),z.lazy(() => CartItemCreateWithoutCartInputSchema).array(),z.lazy(() => CartItemUncheckedCreateWithoutCartInputSchema),z.lazy(() => CartItemUncheckedCreateWithoutCartInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CartItemCreateOrConnectWithoutCartInputSchema),z.lazy(() => CartItemCreateOrConnectWithoutCartInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CartItemCreateManyCartInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CartItemWhereUniqueInputSchema),z.lazy(() => CartItemWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserUncheckedCreateNestedOneWithoutCartInputSchema: z.ZodType<Prisma.UserUncheckedCreateNestedOneWithoutCartInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutCartInputSchema),z.lazy(() => UserUncheckedCreateWithoutCartInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutCartInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const CartItemUpdateManyWithoutCartNestedInputSchema: z.ZodType<Prisma.CartItemUpdateManyWithoutCartNestedInput> = z.object({
  create: z.union([ z.lazy(() => CartItemCreateWithoutCartInputSchema),z.lazy(() => CartItemCreateWithoutCartInputSchema).array(),z.lazy(() => CartItemUncheckedCreateWithoutCartInputSchema),z.lazy(() => CartItemUncheckedCreateWithoutCartInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CartItemCreateOrConnectWithoutCartInputSchema),z.lazy(() => CartItemCreateOrConnectWithoutCartInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CartItemUpsertWithWhereUniqueWithoutCartInputSchema),z.lazy(() => CartItemUpsertWithWhereUniqueWithoutCartInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CartItemCreateManyCartInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CartItemWhereUniqueInputSchema),z.lazy(() => CartItemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CartItemWhereUniqueInputSchema),z.lazy(() => CartItemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CartItemWhereUniqueInputSchema),z.lazy(() => CartItemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CartItemWhereUniqueInputSchema),z.lazy(() => CartItemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CartItemUpdateWithWhereUniqueWithoutCartInputSchema),z.lazy(() => CartItemUpdateWithWhereUniqueWithoutCartInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CartItemUpdateManyWithWhereWithoutCartInputSchema),z.lazy(() => CartItemUpdateManyWithWhereWithoutCartInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CartItemScalarWhereInputSchema),z.lazy(() => CartItemScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PromoCodeUpdateOneWithoutCartNestedInputSchema: z.ZodType<Prisma.PromoCodeUpdateOneWithoutCartNestedInput> = z.object({
  create: z.union([ z.lazy(() => PromoCodeCreateWithoutCartInputSchema),z.lazy(() => PromoCodeUncheckedCreateWithoutCartInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PromoCodeCreateOrConnectWithoutCartInputSchema).optional(),
  upsert: z.lazy(() => PromoCodeUpsertWithoutCartInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => PromoCodeWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => PromoCodeWhereInputSchema) ]).optional(),
  connect: z.lazy(() => PromoCodeWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PromoCodeUpdateToOneWithWhereWithoutCartInputSchema),z.lazy(() => PromoCodeUpdateWithoutCartInputSchema),z.lazy(() => PromoCodeUncheckedUpdateWithoutCartInputSchema) ]).optional(),
}).strict();

export const UserUpdateOneWithoutCartNestedInputSchema: z.ZodType<Prisma.UserUpdateOneWithoutCartNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutCartInputSchema),z.lazy(() => UserUncheckedCreateWithoutCartInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutCartInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutCartInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutCartInputSchema),z.lazy(() => UserUpdateWithoutCartInputSchema),z.lazy(() => UserUncheckedUpdateWithoutCartInputSchema) ]).optional(),
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const CartItemUncheckedUpdateManyWithoutCartNestedInputSchema: z.ZodType<Prisma.CartItemUncheckedUpdateManyWithoutCartNestedInput> = z.object({
  create: z.union([ z.lazy(() => CartItemCreateWithoutCartInputSchema),z.lazy(() => CartItemCreateWithoutCartInputSchema).array(),z.lazy(() => CartItemUncheckedCreateWithoutCartInputSchema),z.lazy(() => CartItemUncheckedCreateWithoutCartInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CartItemCreateOrConnectWithoutCartInputSchema),z.lazy(() => CartItemCreateOrConnectWithoutCartInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CartItemUpsertWithWhereUniqueWithoutCartInputSchema),z.lazy(() => CartItemUpsertWithWhereUniqueWithoutCartInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CartItemCreateManyCartInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CartItemWhereUniqueInputSchema),z.lazy(() => CartItemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CartItemWhereUniqueInputSchema),z.lazy(() => CartItemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CartItemWhereUniqueInputSchema),z.lazy(() => CartItemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CartItemWhereUniqueInputSchema),z.lazy(() => CartItemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CartItemUpdateWithWhereUniqueWithoutCartInputSchema),z.lazy(() => CartItemUpdateWithWhereUniqueWithoutCartInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CartItemUpdateManyWithWhereWithoutCartInputSchema),z.lazy(() => CartItemUpdateManyWithWhereWithoutCartInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CartItemScalarWhereInputSchema),z.lazy(() => CartItemScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserUncheckedUpdateOneWithoutCartNestedInputSchema: z.ZodType<Prisma.UserUncheckedUpdateOneWithoutCartNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutCartInputSchema),z.lazy(() => UserUncheckedCreateWithoutCartInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutCartInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutCartInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutCartInputSchema),z.lazy(() => UserUpdateWithoutCartInputSchema),z.lazy(() => UserUncheckedUpdateWithoutCartInputSchema) ]).optional(),
}).strict();

export const ProductCreateNestedOneWithoutCartItemInputSchema: z.ZodType<Prisma.ProductCreateNestedOneWithoutCartItemInput> = z.object({
  create: z.union([ z.lazy(() => ProductCreateWithoutCartItemInputSchema),z.lazy(() => ProductUncheckedCreateWithoutCartItemInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutCartItemInputSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputSchema).optional()
}).strict();

export const CartCreateNestedOneWithoutCartItemsInputSchema: z.ZodType<Prisma.CartCreateNestedOneWithoutCartItemsInput> = z.object({
  create: z.union([ z.lazy(() => CartCreateWithoutCartItemsInputSchema),z.lazy(() => CartUncheckedCreateWithoutCartItemsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CartCreateOrConnectWithoutCartItemsInputSchema).optional(),
  connect: z.lazy(() => CartWhereUniqueInputSchema).optional()
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const ProductUpdateOneRequiredWithoutCartItemNestedInputSchema: z.ZodType<Prisma.ProductUpdateOneRequiredWithoutCartItemNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProductCreateWithoutCartItemInputSchema),z.lazy(() => ProductUncheckedCreateWithoutCartItemInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutCartItemInputSchema).optional(),
  upsert: z.lazy(() => ProductUpsertWithoutCartItemInputSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProductUpdateToOneWithWhereWithoutCartItemInputSchema),z.lazy(() => ProductUpdateWithoutCartItemInputSchema),z.lazy(() => ProductUncheckedUpdateWithoutCartItemInputSchema) ]).optional(),
}).strict();

export const CartUpdateOneRequiredWithoutCartItemsNestedInputSchema: z.ZodType<Prisma.CartUpdateOneRequiredWithoutCartItemsNestedInput> = z.object({
  create: z.union([ z.lazy(() => CartCreateWithoutCartItemsInputSchema),z.lazy(() => CartUncheckedCreateWithoutCartItemsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CartCreateOrConnectWithoutCartItemsInputSchema).optional(),
  upsert: z.lazy(() => CartUpsertWithoutCartItemsInputSchema).optional(),
  connect: z.lazy(() => CartWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CartUpdateToOneWithWhereWithoutCartItemsInputSchema),z.lazy(() => CartUpdateWithoutCartItemsInputSchema),z.lazy(() => CartUncheckedUpdateWithoutCartItemsInputSchema) ]).optional(),
}).strict();

export const ProductCreateNestedManyWithoutCategoryInputSchema: z.ZodType<Prisma.ProductCreateNestedManyWithoutCategoryInput> = z.object({
  create: z.union([ z.lazy(() => ProductCreateWithoutCategoryInputSchema),z.lazy(() => ProductCreateWithoutCategoryInputSchema).array(),z.lazy(() => ProductUncheckedCreateWithoutCategoryInputSchema),z.lazy(() => ProductUncheckedCreateWithoutCategoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductCreateOrConnectWithoutCategoryInputSchema),z.lazy(() => ProductCreateOrConnectWithoutCategoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductCreateManyCategoryInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const searchCreateNestedManyWithoutCategoryInputSchema: z.ZodType<Prisma.searchCreateNestedManyWithoutCategoryInput> = z.object({
  create: z.union([ z.lazy(() => searchCreateWithoutCategoryInputSchema),z.lazy(() => searchCreateWithoutCategoryInputSchema).array(),z.lazy(() => searchUncheckedCreateWithoutCategoryInputSchema),z.lazy(() => searchUncheckedCreateWithoutCategoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => searchCreateOrConnectWithoutCategoryInputSchema),z.lazy(() => searchCreateOrConnectWithoutCategoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => searchCreateManyCategoryInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => searchWhereUniqueInputSchema),z.lazy(() => searchWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProductUncheckedCreateNestedManyWithoutCategoryInputSchema: z.ZodType<Prisma.ProductUncheckedCreateNestedManyWithoutCategoryInput> = z.object({
  create: z.union([ z.lazy(() => ProductCreateWithoutCategoryInputSchema),z.lazy(() => ProductCreateWithoutCategoryInputSchema).array(),z.lazy(() => ProductUncheckedCreateWithoutCategoryInputSchema),z.lazy(() => ProductUncheckedCreateWithoutCategoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductCreateOrConnectWithoutCategoryInputSchema),z.lazy(() => ProductCreateOrConnectWithoutCategoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductCreateManyCategoryInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const searchUncheckedCreateNestedManyWithoutCategoryInputSchema: z.ZodType<Prisma.searchUncheckedCreateNestedManyWithoutCategoryInput> = z.object({
  create: z.union([ z.lazy(() => searchCreateWithoutCategoryInputSchema),z.lazy(() => searchCreateWithoutCategoryInputSchema).array(),z.lazy(() => searchUncheckedCreateWithoutCategoryInputSchema),z.lazy(() => searchUncheckedCreateWithoutCategoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => searchCreateOrConnectWithoutCategoryInputSchema),z.lazy(() => searchCreateOrConnectWithoutCategoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => searchCreateManyCategoryInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => searchWhereUniqueInputSchema),z.lazy(() => searchWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProductUpdateManyWithoutCategoryNestedInputSchema: z.ZodType<Prisma.ProductUpdateManyWithoutCategoryNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProductCreateWithoutCategoryInputSchema),z.lazy(() => ProductCreateWithoutCategoryInputSchema).array(),z.lazy(() => ProductUncheckedCreateWithoutCategoryInputSchema),z.lazy(() => ProductUncheckedCreateWithoutCategoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductCreateOrConnectWithoutCategoryInputSchema),z.lazy(() => ProductCreateOrConnectWithoutCategoryInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProductUpsertWithWhereUniqueWithoutCategoryInputSchema),z.lazy(() => ProductUpsertWithWhereUniqueWithoutCategoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductCreateManyCategoryInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProductUpdateWithWhereUniqueWithoutCategoryInputSchema),z.lazy(() => ProductUpdateWithWhereUniqueWithoutCategoryInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProductUpdateManyWithWhereWithoutCategoryInputSchema),z.lazy(() => ProductUpdateManyWithWhereWithoutCategoryInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProductScalarWhereInputSchema),z.lazy(() => ProductScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const searchUpdateManyWithoutCategoryNestedInputSchema: z.ZodType<Prisma.searchUpdateManyWithoutCategoryNestedInput> = z.object({
  create: z.union([ z.lazy(() => searchCreateWithoutCategoryInputSchema),z.lazy(() => searchCreateWithoutCategoryInputSchema).array(),z.lazy(() => searchUncheckedCreateWithoutCategoryInputSchema),z.lazy(() => searchUncheckedCreateWithoutCategoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => searchCreateOrConnectWithoutCategoryInputSchema),z.lazy(() => searchCreateOrConnectWithoutCategoryInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => searchUpsertWithWhereUniqueWithoutCategoryInputSchema),z.lazy(() => searchUpsertWithWhereUniqueWithoutCategoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => searchCreateManyCategoryInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => searchWhereUniqueInputSchema),z.lazy(() => searchWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => searchWhereUniqueInputSchema),z.lazy(() => searchWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => searchWhereUniqueInputSchema),z.lazy(() => searchWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => searchWhereUniqueInputSchema),z.lazy(() => searchWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => searchUpdateWithWhereUniqueWithoutCategoryInputSchema),z.lazy(() => searchUpdateWithWhereUniqueWithoutCategoryInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => searchUpdateManyWithWhereWithoutCategoryInputSchema),z.lazy(() => searchUpdateManyWithWhereWithoutCategoryInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => searchScalarWhereInputSchema),z.lazy(() => searchScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProductUncheckedUpdateManyWithoutCategoryNestedInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateManyWithoutCategoryNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProductCreateWithoutCategoryInputSchema),z.lazy(() => ProductCreateWithoutCategoryInputSchema).array(),z.lazy(() => ProductUncheckedCreateWithoutCategoryInputSchema),z.lazy(() => ProductUncheckedCreateWithoutCategoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductCreateOrConnectWithoutCategoryInputSchema),z.lazy(() => ProductCreateOrConnectWithoutCategoryInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProductUpsertWithWhereUniqueWithoutCategoryInputSchema),z.lazy(() => ProductUpsertWithWhereUniqueWithoutCategoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductCreateManyCategoryInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProductUpdateWithWhereUniqueWithoutCategoryInputSchema),z.lazy(() => ProductUpdateWithWhereUniqueWithoutCategoryInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProductUpdateManyWithWhereWithoutCategoryInputSchema),z.lazy(() => ProductUpdateManyWithWhereWithoutCategoryInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProductScalarWhereInputSchema),z.lazy(() => ProductScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const searchUncheckedUpdateManyWithoutCategoryNestedInputSchema: z.ZodType<Prisma.searchUncheckedUpdateManyWithoutCategoryNestedInput> = z.object({
  create: z.union([ z.lazy(() => searchCreateWithoutCategoryInputSchema),z.lazy(() => searchCreateWithoutCategoryInputSchema).array(),z.lazy(() => searchUncheckedCreateWithoutCategoryInputSchema),z.lazy(() => searchUncheckedCreateWithoutCategoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => searchCreateOrConnectWithoutCategoryInputSchema),z.lazy(() => searchCreateOrConnectWithoutCategoryInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => searchUpsertWithWhereUniqueWithoutCategoryInputSchema),z.lazy(() => searchUpsertWithWhereUniqueWithoutCategoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => searchCreateManyCategoryInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => searchWhereUniqueInputSchema),z.lazy(() => searchWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => searchWhereUniqueInputSchema),z.lazy(() => searchWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => searchWhereUniqueInputSchema),z.lazy(() => searchWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => searchWhereUniqueInputSchema),z.lazy(() => searchWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => searchUpdateWithWhereUniqueWithoutCategoryInputSchema),z.lazy(() => searchUpdateWithWhereUniqueWithoutCategoryInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => searchUpdateManyWithWhereWithoutCategoryInputSchema),z.lazy(() => searchUpdateManyWithWhereWithoutCategoryInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => searchScalarWhereInputSchema),z.lazy(() => searchScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutOrdersInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutOrdersInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutOrdersInputSchema),z.lazy(() => UserUncheckedCreateWithoutOrdersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutOrdersInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutOrderTranportsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutOrderTranportsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutOrderTranportsInputSchema),z.lazy(() => UserUncheckedCreateWithoutOrderTranportsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutOrderTranportsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const OrderItemCreateNestedManyWithoutOrderInputSchema: z.ZodType<Prisma.OrderItemCreateNestedManyWithoutOrderInput> = z.object({
  create: z.union([ z.lazy(() => OrderItemCreateWithoutOrderInputSchema),z.lazy(() => OrderItemCreateWithoutOrderInputSchema).array(),z.lazy(() => OrderItemUncheckedCreateWithoutOrderInputSchema),z.lazy(() => OrderItemUncheckedCreateWithoutOrderInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderItemCreateOrConnectWithoutOrderInputSchema),z.lazy(() => OrderItemCreateOrConnectWithoutOrderInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderItemCreateManyOrderInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema),z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PromoCodeCreateNestedOneWithoutOrderInputSchema: z.ZodType<Prisma.PromoCodeCreateNestedOneWithoutOrderInput> = z.object({
  create: z.union([ z.lazy(() => PromoCodeCreateWithoutOrderInputSchema),z.lazy(() => PromoCodeUncheckedCreateWithoutOrderInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PromoCodeCreateOrConnectWithoutOrderInputSchema).optional(),
  connect: z.lazy(() => PromoCodeWhereUniqueInputSchema).optional()
}).strict();

export const AddressCreateNestedOneWithoutOrderInputSchema: z.ZodType<Prisma.AddressCreateNestedOneWithoutOrderInput> = z.object({
  create: z.union([ z.lazy(() => AddressCreateWithoutOrderInputSchema),z.lazy(() => AddressUncheckedCreateWithoutOrderInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AddressCreateOrConnectWithoutOrderInputSchema).optional(),
  connect: z.lazy(() => AddressWhereUniqueInputSchema).optional()
}).strict();

export const OrderItemUncheckedCreateNestedManyWithoutOrderInputSchema: z.ZodType<Prisma.OrderItemUncheckedCreateNestedManyWithoutOrderInput> = z.object({
  create: z.union([ z.lazy(() => OrderItemCreateWithoutOrderInputSchema),z.lazy(() => OrderItemCreateWithoutOrderInputSchema).array(),z.lazy(() => OrderItemUncheckedCreateWithoutOrderInputSchema),z.lazy(() => OrderItemUncheckedCreateWithoutOrderInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderItemCreateOrConnectWithoutOrderInputSchema),z.lazy(() => OrderItemCreateOrConnectWithoutOrderInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderItemCreateManyOrderInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema),z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EnumPaymentMethodFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumPaymentMethodFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => PaymentMethodSchema).optional()
}).strict();

export const EnumOrderStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumOrderStatusFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => OrderStatusSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutOrdersNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutOrdersNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutOrdersInputSchema),z.lazy(() => UserUncheckedCreateWithoutOrdersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutOrdersInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutOrdersInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutOrdersInputSchema),z.lazy(() => UserUpdateWithoutOrdersInputSchema),z.lazy(() => UserUncheckedUpdateWithoutOrdersInputSchema) ]).optional(),
}).strict();

export const UserUpdateOneWithoutOrderTranportsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneWithoutOrderTranportsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutOrderTranportsInputSchema),z.lazy(() => UserUncheckedCreateWithoutOrderTranportsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutOrderTranportsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutOrderTranportsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutOrderTranportsInputSchema),z.lazy(() => UserUpdateWithoutOrderTranportsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutOrderTranportsInputSchema) ]).optional(),
}).strict();

export const OrderItemUpdateManyWithoutOrderNestedInputSchema: z.ZodType<Prisma.OrderItemUpdateManyWithoutOrderNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrderItemCreateWithoutOrderInputSchema),z.lazy(() => OrderItemCreateWithoutOrderInputSchema).array(),z.lazy(() => OrderItemUncheckedCreateWithoutOrderInputSchema),z.lazy(() => OrderItemUncheckedCreateWithoutOrderInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderItemCreateOrConnectWithoutOrderInputSchema),z.lazy(() => OrderItemCreateOrConnectWithoutOrderInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrderItemUpsertWithWhereUniqueWithoutOrderInputSchema),z.lazy(() => OrderItemUpsertWithWhereUniqueWithoutOrderInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderItemCreateManyOrderInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema),z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema),z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema),z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema),z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrderItemUpdateWithWhereUniqueWithoutOrderInputSchema),z.lazy(() => OrderItemUpdateWithWhereUniqueWithoutOrderInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrderItemUpdateManyWithWhereWithoutOrderInputSchema),z.lazy(() => OrderItemUpdateManyWithWhereWithoutOrderInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrderItemScalarWhereInputSchema),z.lazy(() => OrderItemScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PromoCodeUpdateOneWithoutOrderNestedInputSchema: z.ZodType<Prisma.PromoCodeUpdateOneWithoutOrderNestedInput> = z.object({
  create: z.union([ z.lazy(() => PromoCodeCreateWithoutOrderInputSchema),z.lazy(() => PromoCodeUncheckedCreateWithoutOrderInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PromoCodeCreateOrConnectWithoutOrderInputSchema).optional(),
  upsert: z.lazy(() => PromoCodeUpsertWithoutOrderInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => PromoCodeWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => PromoCodeWhereInputSchema) ]).optional(),
  connect: z.lazy(() => PromoCodeWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PromoCodeUpdateToOneWithWhereWithoutOrderInputSchema),z.lazy(() => PromoCodeUpdateWithoutOrderInputSchema),z.lazy(() => PromoCodeUncheckedUpdateWithoutOrderInputSchema) ]).optional(),
}).strict();

export const AddressUpdateOneRequiredWithoutOrderNestedInputSchema: z.ZodType<Prisma.AddressUpdateOneRequiredWithoutOrderNestedInput> = z.object({
  create: z.union([ z.lazy(() => AddressCreateWithoutOrderInputSchema),z.lazy(() => AddressUncheckedCreateWithoutOrderInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AddressCreateOrConnectWithoutOrderInputSchema).optional(),
  upsert: z.lazy(() => AddressUpsertWithoutOrderInputSchema).optional(),
  connect: z.lazy(() => AddressWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => AddressUpdateToOneWithWhereWithoutOrderInputSchema),z.lazy(() => AddressUpdateWithoutOrderInputSchema),z.lazy(() => AddressUncheckedUpdateWithoutOrderInputSchema) ]).optional(),
}).strict();

export const OrderItemUncheckedUpdateManyWithoutOrderNestedInputSchema: z.ZodType<Prisma.OrderItemUncheckedUpdateManyWithoutOrderNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrderItemCreateWithoutOrderInputSchema),z.lazy(() => OrderItemCreateWithoutOrderInputSchema).array(),z.lazy(() => OrderItemUncheckedCreateWithoutOrderInputSchema),z.lazy(() => OrderItemUncheckedCreateWithoutOrderInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderItemCreateOrConnectWithoutOrderInputSchema),z.lazy(() => OrderItemCreateOrConnectWithoutOrderInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrderItemUpsertWithWhereUniqueWithoutOrderInputSchema),z.lazy(() => OrderItemUpsertWithWhereUniqueWithoutOrderInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderItemCreateManyOrderInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema),z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema),z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema),z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema),z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrderItemUpdateWithWhereUniqueWithoutOrderInputSchema),z.lazy(() => OrderItemUpdateWithWhereUniqueWithoutOrderInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrderItemUpdateManyWithWhereWithoutOrderInputSchema),z.lazy(() => OrderItemUpdateManyWithWhereWithoutOrderInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrderItemScalarWhereInputSchema),z.lazy(() => OrderItemScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OrderCreateNestedOneWithoutOrderItemsInputSchema: z.ZodType<Prisma.OrderCreateNestedOneWithoutOrderItemsInput> = z.object({
  create: z.union([ z.lazy(() => OrderCreateWithoutOrderItemsInputSchema),z.lazy(() => OrderUncheckedCreateWithoutOrderItemsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrderCreateOrConnectWithoutOrderItemsInputSchema).optional(),
  connect: z.lazy(() => OrderWhereUniqueInputSchema).optional()
}).strict();

export const ProductCreateNestedOneWithoutOrderItemInputSchema: z.ZodType<Prisma.ProductCreateNestedOneWithoutOrderItemInput> = z.object({
  create: z.union([ z.lazy(() => ProductCreateWithoutOrderItemInputSchema),z.lazy(() => ProductUncheckedCreateWithoutOrderItemInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutOrderItemInputSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputSchema).optional()
}).strict();

export const OrderUpdateOneRequiredWithoutOrderItemsNestedInputSchema: z.ZodType<Prisma.OrderUpdateOneRequiredWithoutOrderItemsNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrderCreateWithoutOrderItemsInputSchema),z.lazy(() => OrderUncheckedCreateWithoutOrderItemsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrderCreateOrConnectWithoutOrderItemsInputSchema).optional(),
  upsert: z.lazy(() => OrderUpsertWithoutOrderItemsInputSchema).optional(),
  connect: z.lazy(() => OrderWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => OrderUpdateToOneWithWhereWithoutOrderItemsInputSchema),z.lazy(() => OrderUpdateWithoutOrderItemsInputSchema),z.lazy(() => OrderUncheckedUpdateWithoutOrderItemsInputSchema) ]).optional(),
}).strict();

export const ProductUpdateOneRequiredWithoutOrderItemNestedInputSchema: z.ZodType<Prisma.ProductUpdateOneRequiredWithoutOrderItemNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProductCreateWithoutOrderItemInputSchema),z.lazy(() => ProductUncheckedCreateWithoutOrderItemInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutOrderItemInputSchema).optional(),
  upsert: z.lazy(() => ProductUpsertWithoutOrderItemInputSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProductUpdateToOneWithWhereWithoutOrderItemInputSchema),z.lazy(() => ProductUpdateWithoutOrderItemInputSchema),z.lazy(() => ProductUncheckedUpdateWithoutOrderItemInputSchema) ]).optional(),
}).strict();

export const ReviewCreateNestedManyWithoutProductInputSchema: z.ZodType<Prisma.ReviewCreateNestedManyWithoutProductInput> = z.object({
  create: z.union([ z.lazy(() => ReviewCreateWithoutProductInputSchema),z.lazy(() => ReviewCreateWithoutProductInputSchema).array(),z.lazy(() => ReviewUncheckedCreateWithoutProductInputSchema),z.lazy(() => ReviewUncheckedCreateWithoutProductInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReviewCreateOrConnectWithoutProductInputSchema),z.lazy(() => ReviewCreateOrConnectWithoutProductInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReviewCreateManyProductInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ReviewWhereUniqueInputSchema),z.lazy(() => ReviewWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CategoryCreateNestedOneWithoutProductsInputSchema: z.ZodType<Prisma.CategoryCreateNestedOneWithoutProductsInput> = z.object({
  create: z.union([ z.lazy(() => CategoryCreateWithoutProductsInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutProductsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CategoryCreateOrConnectWithoutProductsInputSchema).optional(),
  connect: z.lazy(() => CategoryWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedManyWithoutWishlistInputSchema: z.ZodType<Prisma.UserCreateNestedManyWithoutWishlistInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutWishlistInputSchema),z.lazy(() => UserCreateWithoutWishlistInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutWishlistInputSchema),z.lazy(() => UserUncheckedCreateWithoutWishlistInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutWishlistInputSchema),z.lazy(() => UserCreateOrConnectWithoutWishlistInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CartItemCreateNestedManyWithoutProductInputSchema: z.ZodType<Prisma.CartItemCreateNestedManyWithoutProductInput> = z.object({
  create: z.union([ z.lazy(() => CartItemCreateWithoutProductInputSchema),z.lazy(() => CartItemCreateWithoutProductInputSchema).array(),z.lazy(() => CartItemUncheckedCreateWithoutProductInputSchema),z.lazy(() => CartItemUncheckedCreateWithoutProductInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CartItemCreateOrConnectWithoutProductInputSchema),z.lazy(() => CartItemCreateOrConnectWithoutProductInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CartItemCreateManyProductInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CartItemWhereUniqueInputSchema),z.lazy(() => CartItemWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OrderItemCreateNestedManyWithoutProductInputSchema: z.ZodType<Prisma.OrderItemCreateNestedManyWithoutProductInput> = z.object({
  create: z.union([ z.lazy(() => OrderItemCreateWithoutProductInputSchema),z.lazy(() => OrderItemCreateWithoutProductInputSchema).array(),z.lazy(() => OrderItemUncheckedCreateWithoutProductInputSchema),z.lazy(() => OrderItemUncheckedCreateWithoutProductInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderItemCreateOrConnectWithoutProductInputSchema),z.lazy(() => OrderItemCreateOrConnectWithoutProductInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderItemCreateManyProductInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema),z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ReviewUncheckedCreateNestedManyWithoutProductInputSchema: z.ZodType<Prisma.ReviewUncheckedCreateNestedManyWithoutProductInput> = z.object({
  create: z.union([ z.lazy(() => ReviewCreateWithoutProductInputSchema),z.lazy(() => ReviewCreateWithoutProductInputSchema).array(),z.lazy(() => ReviewUncheckedCreateWithoutProductInputSchema),z.lazy(() => ReviewUncheckedCreateWithoutProductInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReviewCreateOrConnectWithoutProductInputSchema),z.lazy(() => ReviewCreateOrConnectWithoutProductInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReviewCreateManyProductInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ReviewWhereUniqueInputSchema),z.lazy(() => ReviewWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserUncheckedCreateNestedManyWithoutWishlistInputSchema: z.ZodType<Prisma.UserUncheckedCreateNestedManyWithoutWishlistInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutWishlistInputSchema),z.lazy(() => UserCreateWithoutWishlistInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutWishlistInputSchema),z.lazy(() => UserUncheckedCreateWithoutWishlistInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutWishlistInputSchema),z.lazy(() => UserCreateOrConnectWithoutWishlistInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CartItemUncheckedCreateNestedManyWithoutProductInputSchema: z.ZodType<Prisma.CartItemUncheckedCreateNestedManyWithoutProductInput> = z.object({
  create: z.union([ z.lazy(() => CartItemCreateWithoutProductInputSchema),z.lazy(() => CartItemCreateWithoutProductInputSchema).array(),z.lazy(() => CartItemUncheckedCreateWithoutProductInputSchema),z.lazy(() => CartItemUncheckedCreateWithoutProductInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CartItemCreateOrConnectWithoutProductInputSchema),z.lazy(() => CartItemCreateOrConnectWithoutProductInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CartItemCreateManyProductInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CartItemWhereUniqueInputSchema),z.lazy(() => CartItemWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OrderItemUncheckedCreateNestedManyWithoutProductInputSchema: z.ZodType<Prisma.OrderItemUncheckedCreateNestedManyWithoutProductInput> = z.object({
  create: z.union([ z.lazy(() => OrderItemCreateWithoutProductInputSchema),z.lazy(() => OrderItemCreateWithoutProductInputSchema).array(),z.lazy(() => OrderItemUncheckedCreateWithoutProductInputSchema),z.lazy(() => OrderItemUncheckedCreateWithoutProductInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderItemCreateOrConnectWithoutProductInputSchema),z.lazy(() => OrderItemCreateOrConnectWithoutProductInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderItemCreateManyProductInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema),z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ReviewUpdateManyWithoutProductNestedInputSchema: z.ZodType<Prisma.ReviewUpdateManyWithoutProductNestedInput> = z.object({
  create: z.union([ z.lazy(() => ReviewCreateWithoutProductInputSchema),z.lazy(() => ReviewCreateWithoutProductInputSchema).array(),z.lazy(() => ReviewUncheckedCreateWithoutProductInputSchema),z.lazy(() => ReviewUncheckedCreateWithoutProductInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReviewCreateOrConnectWithoutProductInputSchema),z.lazy(() => ReviewCreateOrConnectWithoutProductInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ReviewUpsertWithWhereUniqueWithoutProductInputSchema),z.lazy(() => ReviewUpsertWithWhereUniqueWithoutProductInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReviewCreateManyProductInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ReviewWhereUniqueInputSchema),z.lazy(() => ReviewWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ReviewWhereUniqueInputSchema),z.lazy(() => ReviewWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ReviewWhereUniqueInputSchema),z.lazy(() => ReviewWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ReviewWhereUniqueInputSchema),z.lazy(() => ReviewWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ReviewUpdateWithWhereUniqueWithoutProductInputSchema),z.lazy(() => ReviewUpdateWithWhereUniqueWithoutProductInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ReviewUpdateManyWithWhereWithoutProductInputSchema),z.lazy(() => ReviewUpdateManyWithWhereWithoutProductInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ReviewScalarWhereInputSchema),z.lazy(() => ReviewScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CategoryUpdateOneRequiredWithoutProductsNestedInputSchema: z.ZodType<Prisma.CategoryUpdateOneRequiredWithoutProductsNestedInput> = z.object({
  create: z.union([ z.lazy(() => CategoryCreateWithoutProductsInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutProductsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CategoryCreateOrConnectWithoutProductsInputSchema).optional(),
  upsert: z.lazy(() => CategoryUpsertWithoutProductsInputSchema).optional(),
  connect: z.lazy(() => CategoryWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CategoryUpdateToOneWithWhereWithoutProductsInputSchema),z.lazy(() => CategoryUpdateWithoutProductsInputSchema),z.lazy(() => CategoryUncheckedUpdateWithoutProductsInputSchema) ]).optional(),
}).strict();

export const UserUpdateManyWithoutWishlistNestedInputSchema: z.ZodType<Prisma.UserUpdateManyWithoutWishlistNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutWishlistInputSchema),z.lazy(() => UserCreateWithoutWishlistInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutWishlistInputSchema),z.lazy(() => UserUncheckedCreateWithoutWishlistInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutWishlistInputSchema),z.lazy(() => UserCreateOrConnectWithoutWishlistInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserUpsertWithWhereUniqueWithoutWishlistInputSchema),z.lazy(() => UserUpsertWithWhereUniqueWithoutWishlistInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserUpdateWithWhereUniqueWithoutWishlistInputSchema),z.lazy(() => UserUpdateWithWhereUniqueWithoutWishlistInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserUpdateManyWithWhereWithoutWishlistInputSchema),z.lazy(() => UserUpdateManyWithWhereWithoutWishlistInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserScalarWhereInputSchema),z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CartItemUpdateManyWithoutProductNestedInputSchema: z.ZodType<Prisma.CartItemUpdateManyWithoutProductNestedInput> = z.object({
  create: z.union([ z.lazy(() => CartItemCreateWithoutProductInputSchema),z.lazy(() => CartItemCreateWithoutProductInputSchema).array(),z.lazy(() => CartItemUncheckedCreateWithoutProductInputSchema),z.lazy(() => CartItemUncheckedCreateWithoutProductInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CartItemCreateOrConnectWithoutProductInputSchema),z.lazy(() => CartItemCreateOrConnectWithoutProductInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CartItemUpsertWithWhereUniqueWithoutProductInputSchema),z.lazy(() => CartItemUpsertWithWhereUniqueWithoutProductInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CartItemCreateManyProductInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CartItemWhereUniqueInputSchema),z.lazy(() => CartItemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CartItemWhereUniqueInputSchema),z.lazy(() => CartItemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CartItemWhereUniqueInputSchema),z.lazy(() => CartItemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CartItemWhereUniqueInputSchema),z.lazy(() => CartItemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CartItemUpdateWithWhereUniqueWithoutProductInputSchema),z.lazy(() => CartItemUpdateWithWhereUniqueWithoutProductInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CartItemUpdateManyWithWhereWithoutProductInputSchema),z.lazy(() => CartItemUpdateManyWithWhereWithoutProductInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CartItemScalarWhereInputSchema),z.lazy(() => CartItemScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OrderItemUpdateManyWithoutProductNestedInputSchema: z.ZodType<Prisma.OrderItemUpdateManyWithoutProductNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrderItemCreateWithoutProductInputSchema),z.lazy(() => OrderItemCreateWithoutProductInputSchema).array(),z.lazy(() => OrderItemUncheckedCreateWithoutProductInputSchema),z.lazy(() => OrderItemUncheckedCreateWithoutProductInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderItemCreateOrConnectWithoutProductInputSchema),z.lazy(() => OrderItemCreateOrConnectWithoutProductInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrderItemUpsertWithWhereUniqueWithoutProductInputSchema),z.lazy(() => OrderItemUpsertWithWhereUniqueWithoutProductInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderItemCreateManyProductInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema),z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema),z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema),z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema),z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrderItemUpdateWithWhereUniqueWithoutProductInputSchema),z.lazy(() => OrderItemUpdateWithWhereUniqueWithoutProductInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrderItemUpdateManyWithWhereWithoutProductInputSchema),z.lazy(() => OrderItemUpdateManyWithWhereWithoutProductInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrderItemScalarWhereInputSchema),z.lazy(() => OrderItemScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ReviewUncheckedUpdateManyWithoutProductNestedInputSchema: z.ZodType<Prisma.ReviewUncheckedUpdateManyWithoutProductNestedInput> = z.object({
  create: z.union([ z.lazy(() => ReviewCreateWithoutProductInputSchema),z.lazy(() => ReviewCreateWithoutProductInputSchema).array(),z.lazy(() => ReviewUncheckedCreateWithoutProductInputSchema),z.lazy(() => ReviewUncheckedCreateWithoutProductInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReviewCreateOrConnectWithoutProductInputSchema),z.lazy(() => ReviewCreateOrConnectWithoutProductInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ReviewUpsertWithWhereUniqueWithoutProductInputSchema),z.lazy(() => ReviewUpsertWithWhereUniqueWithoutProductInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReviewCreateManyProductInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ReviewWhereUniqueInputSchema),z.lazy(() => ReviewWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ReviewWhereUniqueInputSchema),z.lazy(() => ReviewWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ReviewWhereUniqueInputSchema),z.lazy(() => ReviewWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ReviewWhereUniqueInputSchema),z.lazy(() => ReviewWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ReviewUpdateWithWhereUniqueWithoutProductInputSchema),z.lazy(() => ReviewUpdateWithWhereUniqueWithoutProductInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ReviewUpdateManyWithWhereWithoutProductInputSchema),z.lazy(() => ReviewUpdateManyWithWhereWithoutProductInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ReviewScalarWhereInputSchema),z.lazy(() => ReviewScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserUncheckedUpdateManyWithoutWishlistNestedInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyWithoutWishlistNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutWishlistInputSchema),z.lazy(() => UserCreateWithoutWishlistInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutWishlistInputSchema),z.lazy(() => UserUncheckedCreateWithoutWishlistInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutWishlistInputSchema),z.lazy(() => UserCreateOrConnectWithoutWishlistInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserUpsertWithWhereUniqueWithoutWishlistInputSchema),z.lazy(() => UserUpsertWithWhereUniqueWithoutWishlistInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserUpdateWithWhereUniqueWithoutWishlistInputSchema),z.lazy(() => UserUpdateWithWhereUniqueWithoutWishlistInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserUpdateManyWithWhereWithoutWishlistInputSchema),z.lazy(() => UserUpdateManyWithWhereWithoutWishlistInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserScalarWhereInputSchema),z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CartItemUncheckedUpdateManyWithoutProductNestedInputSchema: z.ZodType<Prisma.CartItemUncheckedUpdateManyWithoutProductNestedInput> = z.object({
  create: z.union([ z.lazy(() => CartItemCreateWithoutProductInputSchema),z.lazy(() => CartItemCreateWithoutProductInputSchema).array(),z.lazy(() => CartItemUncheckedCreateWithoutProductInputSchema),z.lazy(() => CartItemUncheckedCreateWithoutProductInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CartItemCreateOrConnectWithoutProductInputSchema),z.lazy(() => CartItemCreateOrConnectWithoutProductInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CartItemUpsertWithWhereUniqueWithoutProductInputSchema),z.lazy(() => CartItemUpsertWithWhereUniqueWithoutProductInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CartItemCreateManyProductInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CartItemWhereUniqueInputSchema),z.lazy(() => CartItemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CartItemWhereUniqueInputSchema),z.lazy(() => CartItemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CartItemWhereUniqueInputSchema),z.lazy(() => CartItemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CartItemWhereUniqueInputSchema),z.lazy(() => CartItemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CartItemUpdateWithWhereUniqueWithoutProductInputSchema),z.lazy(() => CartItemUpdateWithWhereUniqueWithoutProductInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CartItemUpdateManyWithWhereWithoutProductInputSchema),z.lazy(() => CartItemUpdateManyWithWhereWithoutProductInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CartItemScalarWhereInputSchema),z.lazy(() => CartItemScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OrderItemUncheckedUpdateManyWithoutProductNestedInputSchema: z.ZodType<Prisma.OrderItemUncheckedUpdateManyWithoutProductNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrderItemCreateWithoutProductInputSchema),z.lazy(() => OrderItemCreateWithoutProductInputSchema).array(),z.lazy(() => OrderItemUncheckedCreateWithoutProductInputSchema),z.lazy(() => OrderItemUncheckedCreateWithoutProductInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderItemCreateOrConnectWithoutProductInputSchema),z.lazy(() => OrderItemCreateOrConnectWithoutProductInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrderItemUpsertWithWhereUniqueWithoutProductInputSchema),z.lazy(() => OrderItemUpsertWithWhereUniqueWithoutProductInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderItemCreateManyProductInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema),z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema),z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema),z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema),z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrderItemUpdateWithWhereUniqueWithoutProductInputSchema),z.lazy(() => OrderItemUpdateWithWhereUniqueWithoutProductInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrderItemUpdateManyWithWhereWithoutProductInputSchema),z.lazy(() => OrderItemUpdateManyWithWhereWithoutProductInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrderItemScalarWhereInputSchema),z.lazy(() => OrderItemScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CartCreateNestedManyWithoutPromoCodeInputSchema: z.ZodType<Prisma.CartCreateNestedManyWithoutPromoCodeInput> = z.object({
  create: z.union([ z.lazy(() => CartCreateWithoutPromoCodeInputSchema),z.lazy(() => CartCreateWithoutPromoCodeInputSchema).array(),z.lazy(() => CartUncheckedCreateWithoutPromoCodeInputSchema),z.lazy(() => CartUncheckedCreateWithoutPromoCodeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CartCreateOrConnectWithoutPromoCodeInputSchema),z.lazy(() => CartCreateOrConnectWithoutPromoCodeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CartCreateManyPromoCodeInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CartWhereUniqueInputSchema),z.lazy(() => CartWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OrderCreateNestedManyWithoutPromoCodeInputSchema: z.ZodType<Prisma.OrderCreateNestedManyWithoutPromoCodeInput> = z.object({
  create: z.union([ z.lazy(() => OrderCreateWithoutPromoCodeInputSchema),z.lazy(() => OrderCreateWithoutPromoCodeInputSchema).array(),z.lazy(() => OrderUncheckedCreateWithoutPromoCodeInputSchema),z.lazy(() => OrderUncheckedCreateWithoutPromoCodeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderCreateOrConnectWithoutPromoCodeInputSchema),z.lazy(() => OrderCreateOrConnectWithoutPromoCodeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderCreateManyPromoCodeInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CartUncheckedCreateNestedManyWithoutPromoCodeInputSchema: z.ZodType<Prisma.CartUncheckedCreateNestedManyWithoutPromoCodeInput> = z.object({
  create: z.union([ z.lazy(() => CartCreateWithoutPromoCodeInputSchema),z.lazy(() => CartCreateWithoutPromoCodeInputSchema).array(),z.lazy(() => CartUncheckedCreateWithoutPromoCodeInputSchema),z.lazy(() => CartUncheckedCreateWithoutPromoCodeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CartCreateOrConnectWithoutPromoCodeInputSchema),z.lazy(() => CartCreateOrConnectWithoutPromoCodeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CartCreateManyPromoCodeInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CartWhereUniqueInputSchema),z.lazy(() => CartWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OrderUncheckedCreateNestedManyWithoutPromoCodeInputSchema: z.ZodType<Prisma.OrderUncheckedCreateNestedManyWithoutPromoCodeInput> = z.object({
  create: z.union([ z.lazy(() => OrderCreateWithoutPromoCodeInputSchema),z.lazy(() => OrderCreateWithoutPromoCodeInputSchema).array(),z.lazy(() => OrderUncheckedCreateWithoutPromoCodeInputSchema),z.lazy(() => OrderUncheckedCreateWithoutPromoCodeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderCreateOrConnectWithoutPromoCodeInputSchema),z.lazy(() => OrderCreateOrConnectWithoutPromoCodeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderCreateManyPromoCodeInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CartUpdateManyWithoutPromoCodeNestedInputSchema: z.ZodType<Prisma.CartUpdateManyWithoutPromoCodeNestedInput> = z.object({
  create: z.union([ z.lazy(() => CartCreateWithoutPromoCodeInputSchema),z.lazy(() => CartCreateWithoutPromoCodeInputSchema).array(),z.lazy(() => CartUncheckedCreateWithoutPromoCodeInputSchema),z.lazy(() => CartUncheckedCreateWithoutPromoCodeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CartCreateOrConnectWithoutPromoCodeInputSchema),z.lazy(() => CartCreateOrConnectWithoutPromoCodeInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CartUpsertWithWhereUniqueWithoutPromoCodeInputSchema),z.lazy(() => CartUpsertWithWhereUniqueWithoutPromoCodeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CartCreateManyPromoCodeInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CartWhereUniqueInputSchema),z.lazy(() => CartWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CartWhereUniqueInputSchema),z.lazy(() => CartWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CartWhereUniqueInputSchema),z.lazy(() => CartWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CartWhereUniqueInputSchema),z.lazy(() => CartWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CartUpdateWithWhereUniqueWithoutPromoCodeInputSchema),z.lazy(() => CartUpdateWithWhereUniqueWithoutPromoCodeInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CartUpdateManyWithWhereWithoutPromoCodeInputSchema),z.lazy(() => CartUpdateManyWithWhereWithoutPromoCodeInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CartScalarWhereInputSchema),z.lazy(() => CartScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OrderUpdateManyWithoutPromoCodeNestedInputSchema: z.ZodType<Prisma.OrderUpdateManyWithoutPromoCodeNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrderCreateWithoutPromoCodeInputSchema),z.lazy(() => OrderCreateWithoutPromoCodeInputSchema).array(),z.lazy(() => OrderUncheckedCreateWithoutPromoCodeInputSchema),z.lazy(() => OrderUncheckedCreateWithoutPromoCodeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderCreateOrConnectWithoutPromoCodeInputSchema),z.lazy(() => OrderCreateOrConnectWithoutPromoCodeInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrderUpsertWithWhereUniqueWithoutPromoCodeInputSchema),z.lazy(() => OrderUpsertWithWhereUniqueWithoutPromoCodeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderCreateManyPromoCodeInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrderUpdateWithWhereUniqueWithoutPromoCodeInputSchema),z.lazy(() => OrderUpdateWithWhereUniqueWithoutPromoCodeInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrderUpdateManyWithWhereWithoutPromoCodeInputSchema),z.lazy(() => OrderUpdateManyWithWhereWithoutPromoCodeInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrderScalarWhereInputSchema),z.lazy(() => OrderScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CartUncheckedUpdateManyWithoutPromoCodeNestedInputSchema: z.ZodType<Prisma.CartUncheckedUpdateManyWithoutPromoCodeNestedInput> = z.object({
  create: z.union([ z.lazy(() => CartCreateWithoutPromoCodeInputSchema),z.lazy(() => CartCreateWithoutPromoCodeInputSchema).array(),z.lazy(() => CartUncheckedCreateWithoutPromoCodeInputSchema),z.lazy(() => CartUncheckedCreateWithoutPromoCodeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CartCreateOrConnectWithoutPromoCodeInputSchema),z.lazy(() => CartCreateOrConnectWithoutPromoCodeInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CartUpsertWithWhereUniqueWithoutPromoCodeInputSchema),z.lazy(() => CartUpsertWithWhereUniqueWithoutPromoCodeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CartCreateManyPromoCodeInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CartWhereUniqueInputSchema),z.lazy(() => CartWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CartWhereUniqueInputSchema),z.lazy(() => CartWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CartWhereUniqueInputSchema),z.lazy(() => CartWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CartWhereUniqueInputSchema),z.lazy(() => CartWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CartUpdateWithWhereUniqueWithoutPromoCodeInputSchema),z.lazy(() => CartUpdateWithWhereUniqueWithoutPromoCodeInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CartUpdateManyWithWhereWithoutPromoCodeInputSchema),z.lazy(() => CartUpdateManyWithWhereWithoutPromoCodeInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CartScalarWhereInputSchema),z.lazy(() => CartScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OrderUncheckedUpdateManyWithoutPromoCodeNestedInputSchema: z.ZodType<Prisma.OrderUncheckedUpdateManyWithoutPromoCodeNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrderCreateWithoutPromoCodeInputSchema),z.lazy(() => OrderCreateWithoutPromoCodeInputSchema).array(),z.lazy(() => OrderUncheckedCreateWithoutPromoCodeInputSchema),z.lazy(() => OrderUncheckedCreateWithoutPromoCodeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderCreateOrConnectWithoutPromoCodeInputSchema),z.lazy(() => OrderCreateOrConnectWithoutPromoCodeInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrderUpsertWithWhereUniqueWithoutPromoCodeInputSchema),z.lazy(() => OrderUpsertWithWhereUniqueWithoutPromoCodeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderCreateManyPromoCodeInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrderUpdateWithWhereUniqueWithoutPromoCodeInputSchema),z.lazy(() => OrderUpdateWithWhereUniqueWithoutPromoCodeInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrderUpdateManyWithWhereWithoutPromoCodeInputSchema),z.lazy(() => OrderUpdateManyWithWhereWithoutPromoCodeInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrderScalarWhereInputSchema),z.lazy(() => OrderScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutReturnsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutReturnsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutReturnsInputSchema),z.lazy(() => UserUncheckedCreateWithoutReturnsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutReturnsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutReturnTransportsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutReturnTransportsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutReturnTransportsInputSchema),z.lazy(() => UserUncheckedCreateWithoutReturnTransportsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutReturnTransportsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutReturnsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutReturnsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutReturnsInputSchema),z.lazy(() => UserUncheckedCreateWithoutReturnsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutReturnsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutReturnsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutReturnsInputSchema),z.lazy(() => UserUpdateWithoutReturnsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutReturnsInputSchema) ]).optional(),
}).strict();

export const UserUpdateOneWithoutReturnTransportsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneWithoutReturnTransportsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutReturnTransportsInputSchema),z.lazy(() => UserUncheckedCreateWithoutReturnTransportsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutReturnTransportsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutReturnTransportsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutReturnTransportsInputSchema),z.lazy(() => UserUpdateWithoutReturnTransportsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutReturnTransportsInputSchema) ]).optional(),
}).strict();

export const ProductCreateNestedOneWithoutReviewsInputSchema: z.ZodType<Prisma.ProductCreateNestedOneWithoutReviewsInput> = z.object({
  create: z.union([ z.lazy(() => ProductCreateWithoutReviewsInputSchema),z.lazy(() => ProductUncheckedCreateWithoutReviewsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutReviewsInputSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutReviewInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutReviewInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutReviewInputSchema),z.lazy(() => UserUncheckedCreateWithoutReviewInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutReviewInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const ProductUpdateOneRequiredWithoutReviewsNestedInputSchema: z.ZodType<Prisma.ProductUpdateOneRequiredWithoutReviewsNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProductCreateWithoutReviewsInputSchema),z.lazy(() => ProductUncheckedCreateWithoutReviewsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutReviewsInputSchema).optional(),
  upsert: z.lazy(() => ProductUpsertWithoutReviewsInputSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProductUpdateToOneWithWhereWithoutReviewsInputSchema),z.lazy(() => ProductUpdateWithoutReviewsInputSchema),z.lazy(() => ProductUncheckedUpdateWithoutReviewsInputSchema) ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutReviewNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutReviewNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutReviewInputSchema),z.lazy(() => UserUncheckedCreateWithoutReviewInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutReviewInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutReviewInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutReviewInputSchema),z.lazy(() => UserUpdateWithoutReviewInputSchema),z.lazy(() => UserUncheckedUpdateWithoutReviewInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutSearchInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutSearchInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutSearchInputSchema),z.lazy(() => UserUncheckedCreateWithoutSearchInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSearchInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const CategoryCreateNestedOneWithoutSearchInputSchema: z.ZodType<Prisma.CategoryCreateNestedOneWithoutSearchInput> = z.object({
  create: z.union([ z.lazy(() => CategoryCreateWithoutSearchInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutSearchInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CategoryCreateOrConnectWithoutSearchInputSchema).optional(),
  connect: z.lazy(() => CategoryWhereUniqueInputSchema).optional()
}).strict();

export const UserUpdateOneWithoutSearchNestedInputSchema: z.ZodType<Prisma.UserUpdateOneWithoutSearchNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutSearchInputSchema),z.lazy(() => UserUncheckedCreateWithoutSearchInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSearchInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutSearchInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutSearchInputSchema),z.lazy(() => UserUpdateWithoutSearchInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSearchInputSchema) ]).optional(),
}).strict();

export const CategoryUpdateOneRequiredWithoutSearchNestedInputSchema: z.ZodType<Prisma.CategoryUpdateOneRequiredWithoutSearchNestedInput> = z.object({
  create: z.union([ z.lazy(() => CategoryCreateWithoutSearchInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutSearchInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CategoryCreateOrConnectWithoutSearchInputSchema).optional(),
  upsert: z.lazy(() => CategoryUpsertWithoutSearchInputSchema).optional(),
  connect: z.lazy(() => CategoryWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CategoryUpdateToOneWithWhereWithoutSearchInputSchema),z.lazy(() => CategoryUpdateWithoutSearchInputSchema),z.lazy(() => CategoryUncheckedUpdateWithoutSearchInputSchema) ]).optional(),
}).strict();

export const CartCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.CartCreateNestedOneWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => CartCreateWithoutUserInputSchema),z.lazy(() => CartUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CartCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => CartWhereUniqueInputSchema).optional()
}).strict();

export const AddressCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.AddressCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => AddressCreateWithoutUserInputSchema),z.lazy(() => AddressCreateWithoutUserInputSchema).array(),z.lazy(() => AddressUncheckedCreateWithoutUserInputSchema),z.lazy(() => AddressUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AddressCreateOrConnectWithoutUserInputSchema),z.lazy(() => AddressCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AddressCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AddressWhereUniqueInputSchema),z.lazy(() => AddressWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProductCreateNestedManyWithoutWishersInputSchema: z.ZodType<Prisma.ProductCreateNestedManyWithoutWishersInput> = z.object({
  create: z.union([ z.lazy(() => ProductCreateWithoutWishersInputSchema),z.lazy(() => ProductCreateWithoutWishersInputSchema).array(),z.lazy(() => ProductUncheckedCreateWithoutWishersInputSchema),z.lazy(() => ProductUncheckedCreateWithoutWishersInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductCreateOrConnectWithoutWishersInputSchema),z.lazy(() => ProductCreateOrConnectWithoutWishersInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OrderCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.OrderCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => OrderCreateWithoutUserInputSchema),z.lazy(() => OrderCreateWithoutUserInputSchema).array(),z.lazy(() => OrderUncheckedCreateWithoutUserInputSchema),z.lazy(() => OrderUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderCreateOrConnectWithoutUserInputSchema),z.lazy(() => OrderCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ReturnCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ReturnCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ReturnCreateWithoutUserInputSchema),z.lazy(() => ReturnCreateWithoutUserInputSchema).array(),z.lazy(() => ReturnUncheckedCreateWithoutUserInputSchema),z.lazy(() => ReturnUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReturnCreateOrConnectWithoutUserInputSchema),z.lazy(() => ReturnCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReturnCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ReturnWhereUniqueInputSchema),z.lazy(() => ReturnWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OrderCreateNestedManyWithoutTransporterInputSchema: z.ZodType<Prisma.OrderCreateNestedManyWithoutTransporterInput> = z.object({
  create: z.union([ z.lazy(() => OrderCreateWithoutTransporterInputSchema),z.lazy(() => OrderCreateWithoutTransporterInputSchema).array(),z.lazy(() => OrderUncheckedCreateWithoutTransporterInputSchema),z.lazy(() => OrderUncheckedCreateWithoutTransporterInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderCreateOrConnectWithoutTransporterInputSchema),z.lazy(() => OrderCreateOrConnectWithoutTransporterInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderCreateManyTransporterInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ReturnCreateNestedManyWithoutTransporterInputSchema: z.ZodType<Prisma.ReturnCreateNestedManyWithoutTransporterInput> = z.object({
  create: z.union([ z.lazy(() => ReturnCreateWithoutTransporterInputSchema),z.lazy(() => ReturnCreateWithoutTransporterInputSchema).array(),z.lazy(() => ReturnUncheckedCreateWithoutTransporterInputSchema),z.lazy(() => ReturnUncheckedCreateWithoutTransporterInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReturnCreateOrConnectWithoutTransporterInputSchema),z.lazy(() => ReturnCreateOrConnectWithoutTransporterInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReturnCreateManyTransporterInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ReturnWhereUniqueInputSchema),z.lazy(() => ReturnWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ReviewCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ReviewCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ReviewCreateWithoutUserInputSchema),z.lazy(() => ReviewCreateWithoutUserInputSchema).array(),z.lazy(() => ReviewUncheckedCreateWithoutUserInputSchema),z.lazy(() => ReviewUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReviewCreateOrConnectWithoutUserInputSchema),z.lazy(() => ReviewCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReviewCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ReviewWhereUniqueInputSchema),z.lazy(() => ReviewWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const searchCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.searchCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => searchCreateWithoutUserInputSchema),z.lazy(() => searchCreateWithoutUserInputSchema).array(),z.lazy(() => searchUncheckedCreateWithoutUserInputSchema),z.lazy(() => searchUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => searchCreateOrConnectWithoutUserInputSchema),z.lazy(() => searchCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => searchCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => searchWhereUniqueInputSchema),z.lazy(() => searchWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AddressUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.AddressUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => AddressCreateWithoutUserInputSchema),z.lazy(() => AddressCreateWithoutUserInputSchema).array(),z.lazy(() => AddressUncheckedCreateWithoutUserInputSchema),z.lazy(() => AddressUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AddressCreateOrConnectWithoutUserInputSchema),z.lazy(() => AddressCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AddressCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AddressWhereUniqueInputSchema),z.lazy(() => AddressWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProductUncheckedCreateNestedManyWithoutWishersInputSchema: z.ZodType<Prisma.ProductUncheckedCreateNestedManyWithoutWishersInput> = z.object({
  create: z.union([ z.lazy(() => ProductCreateWithoutWishersInputSchema),z.lazy(() => ProductCreateWithoutWishersInputSchema).array(),z.lazy(() => ProductUncheckedCreateWithoutWishersInputSchema),z.lazy(() => ProductUncheckedCreateWithoutWishersInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductCreateOrConnectWithoutWishersInputSchema),z.lazy(() => ProductCreateOrConnectWithoutWishersInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OrderUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.OrderUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => OrderCreateWithoutUserInputSchema),z.lazy(() => OrderCreateWithoutUserInputSchema).array(),z.lazy(() => OrderUncheckedCreateWithoutUserInputSchema),z.lazy(() => OrderUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderCreateOrConnectWithoutUserInputSchema),z.lazy(() => OrderCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ReturnUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ReturnUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ReturnCreateWithoutUserInputSchema),z.lazy(() => ReturnCreateWithoutUserInputSchema).array(),z.lazy(() => ReturnUncheckedCreateWithoutUserInputSchema),z.lazy(() => ReturnUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReturnCreateOrConnectWithoutUserInputSchema),z.lazy(() => ReturnCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReturnCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ReturnWhereUniqueInputSchema),z.lazy(() => ReturnWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OrderUncheckedCreateNestedManyWithoutTransporterInputSchema: z.ZodType<Prisma.OrderUncheckedCreateNestedManyWithoutTransporterInput> = z.object({
  create: z.union([ z.lazy(() => OrderCreateWithoutTransporterInputSchema),z.lazy(() => OrderCreateWithoutTransporterInputSchema).array(),z.lazy(() => OrderUncheckedCreateWithoutTransporterInputSchema),z.lazy(() => OrderUncheckedCreateWithoutTransporterInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderCreateOrConnectWithoutTransporterInputSchema),z.lazy(() => OrderCreateOrConnectWithoutTransporterInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderCreateManyTransporterInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ReturnUncheckedCreateNestedManyWithoutTransporterInputSchema: z.ZodType<Prisma.ReturnUncheckedCreateNestedManyWithoutTransporterInput> = z.object({
  create: z.union([ z.lazy(() => ReturnCreateWithoutTransporterInputSchema),z.lazy(() => ReturnCreateWithoutTransporterInputSchema).array(),z.lazy(() => ReturnUncheckedCreateWithoutTransporterInputSchema),z.lazy(() => ReturnUncheckedCreateWithoutTransporterInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReturnCreateOrConnectWithoutTransporterInputSchema),z.lazy(() => ReturnCreateOrConnectWithoutTransporterInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReturnCreateManyTransporterInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ReturnWhereUniqueInputSchema),z.lazy(() => ReturnWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ReviewUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ReviewUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ReviewCreateWithoutUserInputSchema),z.lazy(() => ReviewCreateWithoutUserInputSchema).array(),z.lazy(() => ReviewUncheckedCreateWithoutUserInputSchema),z.lazy(() => ReviewUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReviewCreateOrConnectWithoutUserInputSchema),z.lazy(() => ReviewCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReviewCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ReviewWhereUniqueInputSchema),z.lazy(() => ReviewWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const searchUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.searchUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => searchCreateWithoutUserInputSchema),z.lazy(() => searchCreateWithoutUserInputSchema).array(),z.lazy(() => searchUncheckedCreateWithoutUserInputSchema),z.lazy(() => searchUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => searchCreateOrConnectWithoutUserInputSchema),z.lazy(() => searchCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => searchCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => searchWhereUniqueInputSchema),z.lazy(() => searchWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EnumGenderFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumGenderFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => GenderSchema).optional()
}).strict();

export const EnumRoleFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumRoleFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => RoleSchema).optional()
}).strict();

export const CartUpdateOneRequiredWithoutUserNestedInputSchema: z.ZodType<Prisma.CartUpdateOneRequiredWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => CartCreateWithoutUserInputSchema),z.lazy(() => CartUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CartCreateOrConnectWithoutUserInputSchema).optional(),
  upsert: z.lazy(() => CartUpsertWithoutUserInputSchema).optional(),
  connect: z.lazy(() => CartWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CartUpdateToOneWithWhereWithoutUserInputSchema),z.lazy(() => CartUpdateWithoutUserInputSchema),z.lazy(() => CartUncheckedUpdateWithoutUserInputSchema) ]).optional(),
}).strict();

export const AddressUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.AddressUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => AddressCreateWithoutUserInputSchema),z.lazy(() => AddressCreateWithoutUserInputSchema).array(),z.lazy(() => AddressUncheckedCreateWithoutUserInputSchema),z.lazy(() => AddressUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AddressCreateOrConnectWithoutUserInputSchema),z.lazy(() => AddressCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AddressUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => AddressUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AddressCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AddressWhereUniqueInputSchema),z.lazy(() => AddressWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AddressWhereUniqueInputSchema),z.lazy(() => AddressWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AddressWhereUniqueInputSchema),z.lazy(() => AddressWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AddressWhereUniqueInputSchema),z.lazy(() => AddressWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AddressUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => AddressUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AddressUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => AddressUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AddressScalarWhereInputSchema),z.lazy(() => AddressScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProductUpdateManyWithoutWishersNestedInputSchema: z.ZodType<Prisma.ProductUpdateManyWithoutWishersNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProductCreateWithoutWishersInputSchema),z.lazy(() => ProductCreateWithoutWishersInputSchema).array(),z.lazy(() => ProductUncheckedCreateWithoutWishersInputSchema),z.lazy(() => ProductUncheckedCreateWithoutWishersInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductCreateOrConnectWithoutWishersInputSchema),z.lazy(() => ProductCreateOrConnectWithoutWishersInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProductUpsertWithWhereUniqueWithoutWishersInputSchema),z.lazy(() => ProductUpsertWithWhereUniqueWithoutWishersInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProductUpdateWithWhereUniqueWithoutWishersInputSchema),z.lazy(() => ProductUpdateWithWhereUniqueWithoutWishersInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProductUpdateManyWithWhereWithoutWishersInputSchema),z.lazy(() => ProductUpdateManyWithWhereWithoutWishersInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProductScalarWhereInputSchema),z.lazy(() => ProductScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OrderUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.OrderUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrderCreateWithoutUserInputSchema),z.lazy(() => OrderCreateWithoutUserInputSchema).array(),z.lazy(() => OrderUncheckedCreateWithoutUserInputSchema),z.lazy(() => OrderUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderCreateOrConnectWithoutUserInputSchema),z.lazy(() => OrderCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrderUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => OrderUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrderUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => OrderUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrderUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => OrderUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrderScalarWhereInputSchema),z.lazy(() => OrderScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ReturnUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ReturnUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ReturnCreateWithoutUserInputSchema),z.lazy(() => ReturnCreateWithoutUserInputSchema).array(),z.lazy(() => ReturnUncheckedCreateWithoutUserInputSchema),z.lazy(() => ReturnUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReturnCreateOrConnectWithoutUserInputSchema),z.lazy(() => ReturnCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ReturnUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ReturnUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReturnCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ReturnWhereUniqueInputSchema),z.lazy(() => ReturnWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ReturnWhereUniqueInputSchema),z.lazy(() => ReturnWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ReturnWhereUniqueInputSchema),z.lazy(() => ReturnWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ReturnWhereUniqueInputSchema),z.lazy(() => ReturnWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ReturnUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ReturnUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ReturnUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ReturnUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ReturnScalarWhereInputSchema),z.lazy(() => ReturnScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OrderUpdateManyWithoutTransporterNestedInputSchema: z.ZodType<Prisma.OrderUpdateManyWithoutTransporterNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrderCreateWithoutTransporterInputSchema),z.lazy(() => OrderCreateWithoutTransporterInputSchema).array(),z.lazy(() => OrderUncheckedCreateWithoutTransporterInputSchema),z.lazy(() => OrderUncheckedCreateWithoutTransporterInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderCreateOrConnectWithoutTransporterInputSchema),z.lazy(() => OrderCreateOrConnectWithoutTransporterInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrderUpsertWithWhereUniqueWithoutTransporterInputSchema),z.lazy(() => OrderUpsertWithWhereUniqueWithoutTransporterInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderCreateManyTransporterInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrderUpdateWithWhereUniqueWithoutTransporterInputSchema),z.lazy(() => OrderUpdateWithWhereUniqueWithoutTransporterInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrderUpdateManyWithWhereWithoutTransporterInputSchema),z.lazy(() => OrderUpdateManyWithWhereWithoutTransporterInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrderScalarWhereInputSchema),z.lazy(() => OrderScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ReturnUpdateManyWithoutTransporterNestedInputSchema: z.ZodType<Prisma.ReturnUpdateManyWithoutTransporterNestedInput> = z.object({
  create: z.union([ z.lazy(() => ReturnCreateWithoutTransporterInputSchema),z.lazy(() => ReturnCreateWithoutTransporterInputSchema).array(),z.lazy(() => ReturnUncheckedCreateWithoutTransporterInputSchema),z.lazy(() => ReturnUncheckedCreateWithoutTransporterInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReturnCreateOrConnectWithoutTransporterInputSchema),z.lazy(() => ReturnCreateOrConnectWithoutTransporterInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ReturnUpsertWithWhereUniqueWithoutTransporterInputSchema),z.lazy(() => ReturnUpsertWithWhereUniqueWithoutTransporterInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReturnCreateManyTransporterInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ReturnWhereUniqueInputSchema),z.lazy(() => ReturnWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ReturnWhereUniqueInputSchema),z.lazy(() => ReturnWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ReturnWhereUniqueInputSchema),z.lazy(() => ReturnWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ReturnWhereUniqueInputSchema),z.lazy(() => ReturnWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ReturnUpdateWithWhereUniqueWithoutTransporterInputSchema),z.lazy(() => ReturnUpdateWithWhereUniqueWithoutTransporterInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ReturnUpdateManyWithWhereWithoutTransporterInputSchema),z.lazy(() => ReturnUpdateManyWithWhereWithoutTransporterInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ReturnScalarWhereInputSchema),z.lazy(() => ReturnScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ReviewUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ReviewUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ReviewCreateWithoutUserInputSchema),z.lazy(() => ReviewCreateWithoutUserInputSchema).array(),z.lazy(() => ReviewUncheckedCreateWithoutUserInputSchema),z.lazy(() => ReviewUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReviewCreateOrConnectWithoutUserInputSchema),z.lazy(() => ReviewCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ReviewUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ReviewUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReviewCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ReviewWhereUniqueInputSchema),z.lazy(() => ReviewWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ReviewWhereUniqueInputSchema),z.lazy(() => ReviewWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ReviewWhereUniqueInputSchema),z.lazy(() => ReviewWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ReviewWhereUniqueInputSchema),z.lazy(() => ReviewWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ReviewUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ReviewUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ReviewUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ReviewUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ReviewScalarWhereInputSchema),z.lazy(() => ReviewScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const searchUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.searchUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => searchCreateWithoutUserInputSchema),z.lazy(() => searchCreateWithoutUserInputSchema).array(),z.lazy(() => searchUncheckedCreateWithoutUserInputSchema),z.lazy(() => searchUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => searchCreateOrConnectWithoutUserInputSchema),z.lazy(() => searchCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => searchUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => searchUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => searchCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => searchWhereUniqueInputSchema),z.lazy(() => searchWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => searchWhereUniqueInputSchema),z.lazy(() => searchWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => searchWhereUniqueInputSchema),z.lazy(() => searchWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => searchWhereUniqueInputSchema),z.lazy(() => searchWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => searchUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => searchUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => searchUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => searchUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => searchScalarWhereInputSchema),z.lazy(() => searchScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AddressUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.AddressUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => AddressCreateWithoutUserInputSchema),z.lazy(() => AddressCreateWithoutUserInputSchema).array(),z.lazy(() => AddressUncheckedCreateWithoutUserInputSchema),z.lazy(() => AddressUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AddressCreateOrConnectWithoutUserInputSchema),z.lazy(() => AddressCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AddressUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => AddressUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AddressCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AddressWhereUniqueInputSchema),z.lazy(() => AddressWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AddressWhereUniqueInputSchema),z.lazy(() => AddressWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AddressWhereUniqueInputSchema),z.lazy(() => AddressWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AddressWhereUniqueInputSchema),z.lazy(() => AddressWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AddressUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => AddressUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AddressUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => AddressUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AddressScalarWhereInputSchema),z.lazy(() => AddressScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProductUncheckedUpdateManyWithoutWishersNestedInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateManyWithoutWishersNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProductCreateWithoutWishersInputSchema),z.lazy(() => ProductCreateWithoutWishersInputSchema).array(),z.lazy(() => ProductUncheckedCreateWithoutWishersInputSchema),z.lazy(() => ProductUncheckedCreateWithoutWishersInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductCreateOrConnectWithoutWishersInputSchema),z.lazy(() => ProductCreateOrConnectWithoutWishersInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProductUpsertWithWhereUniqueWithoutWishersInputSchema),z.lazy(() => ProductUpsertWithWhereUniqueWithoutWishersInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProductUpdateWithWhereUniqueWithoutWishersInputSchema),z.lazy(() => ProductUpdateWithWhereUniqueWithoutWishersInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProductUpdateManyWithWhereWithoutWishersInputSchema),z.lazy(() => ProductUpdateManyWithWhereWithoutWishersInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProductScalarWhereInputSchema),z.lazy(() => ProductScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OrderUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.OrderUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrderCreateWithoutUserInputSchema),z.lazy(() => OrderCreateWithoutUserInputSchema).array(),z.lazy(() => OrderUncheckedCreateWithoutUserInputSchema),z.lazy(() => OrderUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderCreateOrConnectWithoutUserInputSchema),z.lazy(() => OrderCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrderUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => OrderUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrderUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => OrderUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrderUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => OrderUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrderScalarWhereInputSchema),z.lazy(() => OrderScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ReturnUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ReturnUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ReturnCreateWithoutUserInputSchema),z.lazy(() => ReturnCreateWithoutUserInputSchema).array(),z.lazy(() => ReturnUncheckedCreateWithoutUserInputSchema),z.lazy(() => ReturnUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReturnCreateOrConnectWithoutUserInputSchema),z.lazy(() => ReturnCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ReturnUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ReturnUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReturnCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ReturnWhereUniqueInputSchema),z.lazy(() => ReturnWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ReturnWhereUniqueInputSchema),z.lazy(() => ReturnWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ReturnWhereUniqueInputSchema),z.lazy(() => ReturnWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ReturnWhereUniqueInputSchema),z.lazy(() => ReturnWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ReturnUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ReturnUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ReturnUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ReturnUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ReturnScalarWhereInputSchema),z.lazy(() => ReturnScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OrderUncheckedUpdateManyWithoutTransporterNestedInputSchema: z.ZodType<Prisma.OrderUncheckedUpdateManyWithoutTransporterNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrderCreateWithoutTransporterInputSchema),z.lazy(() => OrderCreateWithoutTransporterInputSchema).array(),z.lazy(() => OrderUncheckedCreateWithoutTransporterInputSchema),z.lazy(() => OrderUncheckedCreateWithoutTransporterInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderCreateOrConnectWithoutTransporterInputSchema),z.lazy(() => OrderCreateOrConnectWithoutTransporterInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrderUpsertWithWhereUniqueWithoutTransporterInputSchema),z.lazy(() => OrderUpsertWithWhereUniqueWithoutTransporterInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderCreateManyTransporterInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrderUpdateWithWhereUniqueWithoutTransporterInputSchema),z.lazy(() => OrderUpdateWithWhereUniqueWithoutTransporterInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrderUpdateManyWithWhereWithoutTransporterInputSchema),z.lazy(() => OrderUpdateManyWithWhereWithoutTransporterInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrderScalarWhereInputSchema),z.lazy(() => OrderScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ReturnUncheckedUpdateManyWithoutTransporterNestedInputSchema: z.ZodType<Prisma.ReturnUncheckedUpdateManyWithoutTransporterNestedInput> = z.object({
  create: z.union([ z.lazy(() => ReturnCreateWithoutTransporterInputSchema),z.lazy(() => ReturnCreateWithoutTransporterInputSchema).array(),z.lazy(() => ReturnUncheckedCreateWithoutTransporterInputSchema),z.lazy(() => ReturnUncheckedCreateWithoutTransporterInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReturnCreateOrConnectWithoutTransporterInputSchema),z.lazy(() => ReturnCreateOrConnectWithoutTransporterInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ReturnUpsertWithWhereUniqueWithoutTransporterInputSchema),z.lazy(() => ReturnUpsertWithWhereUniqueWithoutTransporterInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReturnCreateManyTransporterInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ReturnWhereUniqueInputSchema),z.lazy(() => ReturnWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ReturnWhereUniqueInputSchema),z.lazy(() => ReturnWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ReturnWhereUniqueInputSchema),z.lazy(() => ReturnWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ReturnWhereUniqueInputSchema),z.lazy(() => ReturnWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ReturnUpdateWithWhereUniqueWithoutTransporterInputSchema),z.lazy(() => ReturnUpdateWithWhereUniqueWithoutTransporterInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ReturnUpdateManyWithWhereWithoutTransporterInputSchema),z.lazy(() => ReturnUpdateManyWithWhereWithoutTransporterInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ReturnScalarWhereInputSchema),z.lazy(() => ReturnScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ReviewUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ReviewUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ReviewCreateWithoutUserInputSchema),z.lazy(() => ReviewCreateWithoutUserInputSchema).array(),z.lazy(() => ReviewUncheckedCreateWithoutUserInputSchema),z.lazy(() => ReviewUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReviewCreateOrConnectWithoutUserInputSchema),z.lazy(() => ReviewCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ReviewUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ReviewUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReviewCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ReviewWhereUniqueInputSchema),z.lazy(() => ReviewWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ReviewWhereUniqueInputSchema),z.lazy(() => ReviewWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ReviewWhereUniqueInputSchema),z.lazy(() => ReviewWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ReviewWhereUniqueInputSchema),z.lazy(() => ReviewWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ReviewUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ReviewUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ReviewUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ReviewUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ReviewScalarWhereInputSchema),z.lazy(() => ReviewScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const searchUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.searchUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => searchCreateWithoutUserInputSchema),z.lazy(() => searchCreateWithoutUserInputSchema).array(),z.lazy(() => searchUncheckedCreateWithoutUserInputSchema),z.lazy(() => searchUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => searchCreateOrConnectWithoutUserInputSchema),z.lazy(() => searchCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => searchUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => searchUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => searchCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => searchWhereUniqueInputSchema),z.lazy(() => searchWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => searchWhereUniqueInputSchema),z.lazy(() => searchWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => searchWhereUniqueInputSchema),z.lazy(() => searchWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => searchWhereUniqueInputSchema),z.lazy(() => searchWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => searchUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => searchUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => searchUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => searchUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => searchScalarWhereInputSchema),z.lazy(() => searchScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const NestedEnumPaymentMethodFilterSchema: z.ZodType<Prisma.NestedEnumPaymentMethodFilter> = z.object({
  equals: z.lazy(() => PaymentMethodSchema).optional(),
  in: z.lazy(() => PaymentMethodSchema).array().optional(),
  notIn: z.lazy(() => PaymentMethodSchema).array().optional(),
  not: z.union([ z.lazy(() => PaymentMethodSchema),z.lazy(() => NestedEnumPaymentMethodFilterSchema) ]).optional(),
}).strict();

export const NestedEnumOrderStatusFilterSchema: z.ZodType<Prisma.NestedEnumOrderStatusFilter> = z.object({
  equals: z.lazy(() => OrderStatusSchema).optional(),
  in: z.lazy(() => OrderStatusSchema).array().optional(),
  notIn: z.lazy(() => OrderStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => OrderStatusSchema),z.lazy(() => NestedEnumOrderStatusFilterSchema) ]).optional(),
}).strict();

export const NestedEnumPaymentMethodWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumPaymentMethodWithAggregatesFilter> = z.object({
  equals: z.lazy(() => PaymentMethodSchema).optional(),
  in: z.lazy(() => PaymentMethodSchema).array().optional(),
  notIn: z.lazy(() => PaymentMethodSchema).array().optional(),
  not: z.union([ z.lazy(() => PaymentMethodSchema),z.lazy(() => NestedEnumPaymentMethodWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumPaymentMethodFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumPaymentMethodFilterSchema).optional()
}).strict();

export const NestedEnumOrderStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumOrderStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => OrderStatusSchema).optional(),
  in: z.lazy(() => OrderStatusSchema).array().optional(),
  notIn: z.lazy(() => OrderStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => OrderStatusSchema),z.lazy(() => NestedEnumOrderStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumOrderStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumOrderStatusFilterSchema).optional()
}).strict();

export const NestedEnumGenderFilterSchema: z.ZodType<Prisma.NestedEnumGenderFilter> = z.object({
  equals: z.lazy(() => GenderSchema).optional(),
  in: z.lazy(() => GenderSchema).array().optional(),
  notIn: z.lazy(() => GenderSchema).array().optional(),
  not: z.union([ z.lazy(() => GenderSchema),z.lazy(() => NestedEnumGenderFilterSchema) ]).optional(),
}).strict();

export const NestedEnumRoleFilterSchema: z.ZodType<Prisma.NestedEnumRoleFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NestedEnumRoleFilterSchema) ]).optional(),
}).strict();

export const NestedEnumGenderWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumGenderWithAggregatesFilter> = z.object({
  equals: z.lazy(() => GenderSchema).optional(),
  in: z.lazy(() => GenderSchema).array().optional(),
  notIn: z.lazy(() => GenderSchema).array().optional(),
  not: z.union([ z.lazy(() => GenderSchema),z.lazy(() => NestedEnumGenderWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumGenderFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumGenderFilterSchema).optional()
}).strict();

export const NestedEnumRoleWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NestedEnumRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRoleFilterSchema).optional()
}).strict();

export const UserCreateWithoutAddressesInputSchema: z.ZodType<Prisma.UserCreateWithoutAddressesInput> = z.object({
  id: z.string().uuid().optional(),
  email: z.string(),
  emailVerified: z.boolean().optional(),
  passwordHash: z.string(),
  name: z.string(),
  gender: z.lazy(() => GenderSchema),
  dob: z.coerce.date(),
  phone: z.string().optional().nullable(),
  phoneVerified: z.boolean().optional(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  cart: z.lazy(() => CartCreateNestedOneWithoutUserInputSchema),
  wishlist: z.lazy(() => ProductCreateNestedManyWithoutWishersInputSchema).optional(),
  orders: z.lazy(() => OrderCreateNestedManyWithoutUserInputSchema).optional(),
  returns: z.lazy(() => ReturnCreateNestedManyWithoutUserInputSchema).optional(),
  orderTranports: z.lazy(() => OrderCreateNestedManyWithoutTransporterInputSchema).optional(),
  returnTransports: z.lazy(() => ReturnCreateNestedManyWithoutTransporterInputSchema).optional(),
  Review: z.lazy(() => ReviewCreateNestedManyWithoutUserInputSchema).optional(),
  search: z.lazy(() => searchCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutAddressesInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutAddressesInput> = z.object({
  id: z.string().uuid().optional(),
  email: z.string(),
  emailVerified: z.boolean().optional(),
  passwordHash: z.string(),
  name: z.string(),
  gender: z.lazy(() => GenderSchema),
  dob: z.coerce.date(),
  phone: z.string().optional().nullable(),
  phoneVerified: z.boolean().optional(),
  role: z.lazy(() => RoleSchema).optional(),
  cartId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  wishlist: z.lazy(() => ProductUncheckedCreateNestedManyWithoutWishersInputSchema).optional(),
  orders: z.lazy(() => OrderUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  returns: z.lazy(() => ReturnUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  orderTranports: z.lazy(() => OrderUncheckedCreateNestedManyWithoutTransporterInputSchema).optional(),
  returnTransports: z.lazy(() => ReturnUncheckedCreateNestedManyWithoutTransporterInputSchema).optional(),
  Review: z.lazy(() => ReviewUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  search: z.lazy(() => searchUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutAddressesInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutAddressesInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutAddressesInputSchema),z.lazy(() => UserUncheckedCreateWithoutAddressesInputSchema) ]),
}).strict();

export const OrderCreateWithoutDeliveryAddressInputSchema: z.ZodType<Prisma.OrderCreateWithoutDeliveryAddressInput> = z.object({
  id: z.string().uuid().optional(),
  totalCents: z.number().int(),
  currency: z.string().optional(),
  paymentMethod: z.lazy(() => PaymentMethodSchema),
  deliveryNeeded: z.boolean(),
  status: z.lazy(() => OrderStatusSchema),
  PaymobOrderId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deliveredAt: z.coerce.date().optional().nullable(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutOrdersInputSchema),
  transporter: z.lazy(() => UserCreateNestedOneWithoutOrderTranportsInputSchema).optional(),
  orderItems: z.lazy(() => OrderItemCreateNestedManyWithoutOrderInputSchema).optional(),
  promoCode: z.lazy(() => PromoCodeCreateNestedOneWithoutOrderInputSchema).optional()
}).strict();

export const OrderUncheckedCreateWithoutDeliveryAddressInputSchema: z.ZodType<Prisma.OrderUncheckedCreateWithoutDeliveryAddressInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  transporterId: z.string().optional().nullable(),
  promoCodeId: z.string().optional().nullable(),
  totalCents: z.number().int(),
  currency: z.string().optional(),
  paymentMethod: z.lazy(() => PaymentMethodSchema),
  deliveryNeeded: z.boolean(),
  status: z.lazy(() => OrderStatusSchema),
  PaymobOrderId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deliveredAt: z.coerce.date().optional().nullable(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  orderItems: z.lazy(() => OrderItemUncheckedCreateNestedManyWithoutOrderInputSchema).optional()
}).strict();

export const OrderCreateOrConnectWithoutDeliveryAddressInputSchema: z.ZodType<Prisma.OrderCreateOrConnectWithoutDeliveryAddressInput> = z.object({
  where: z.lazy(() => OrderWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrderCreateWithoutDeliveryAddressInputSchema),z.lazy(() => OrderUncheckedCreateWithoutDeliveryAddressInputSchema) ]),
}).strict();

export const OrderCreateManyDeliveryAddressInputEnvelopeSchema: z.ZodType<Prisma.OrderCreateManyDeliveryAddressInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => OrderCreateManyDeliveryAddressInputSchema),z.lazy(() => OrderCreateManyDeliveryAddressInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserUpsertWithoutAddressesInputSchema: z.ZodType<Prisma.UserUpsertWithoutAddressesInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutAddressesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAddressesInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutAddressesInputSchema),z.lazy(() => UserUncheckedCreateWithoutAddressesInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutAddressesInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutAddressesInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutAddressesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAddressesInputSchema) ]),
}).strict();

export const UserUpdateWithoutAddressesInputSchema: z.ZodType<Prisma.UserUpdateWithoutAddressesInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  passwordHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => GenderSchema),z.lazy(() => EnumGenderFieldUpdateOperationsInputSchema) ]).optional(),
  dob: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cart: z.lazy(() => CartUpdateOneRequiredWithoutUserNestedInputSchema).optional(),
  wishlist: z.lazy(() => ProductUpdateManyWithoutWishersNestedInputSchema).optional(),
  orders: z.lazy(() => OrderUpdateManyWithoutUserNestedInputSchema).optional(),
  returns: z.lazy(() => ReturnUpdateManyWithoutUserNestedInputSchema).optional(),
  orderTranports: z.lazy(() => OrderUpdateManyWithoutTransporterNestedInputSchema).optional(),
  returnTransports: z.lazy(() => ReturnUpdateManyWithoutTransporterNestedInputSchema).optional(),
  Review: z.lazy(() => ReviewUpdateManyWithoutUserNestedInputSchema).optional(),
  search: z.lazy(() => searchUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutAddressesInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutAddressesInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  passwordHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => GenderSchema),z.lazy(() => EnumGenderFieldUpdateOperationsInputSchema) ]).optional(),
  dob: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  cartId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  wishlist: z.lazy(() => ProductUncheckedUpdateManyWithoutWishersNestedInputSchema).optional(),
  orders: z.lazy(() => OrderUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  returns: z.lazy(() => ReturnUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  orderTranports: z.lazy(() => OrderUncheckedUpdateManyWithoutTransporterNestedInputSchema).optional(),
  returnTransports: z.lazy(() => ReturnUncheckedUpdateManyWithoutTransporterNestedInputSchema).optional(),
  Review: z.lazy(() => ReviewUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  search: z.lazy(() => searchUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const OrderUpsertWithWhereUniqueWithoutDeliveryAddressInputSchema: z.ZodType<Prisma.OrderUpsertWithWhereUniqueWithoutDeliveryAddressInput> = z.object({
  where: z.lazy(() => OrderWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => OrderUpdateWithoutDeliveryAddressInputSchema),z.lazy(() => OrderUncheckedUpdateWithoutDeliveryAddressInputSchema) ]),
  create: z.union([ z.lazy(() => OrderCreateWithoutDeliveryAddressInputSchema),z.lazy(() => OrderUncheckedCreateWithoutDeliveryAddressInputSchema) ]),
}).strict();

export const OrderUpdateWithWhereUniqueWithoutDeliveryAddressInputSchema: z.ZodType<Prisma.OrderUpdateWithWhereUniqueWithoutDeliveryAddressInput> = z.object({
  where: z.lazy(() => OrderWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => OrderUpdateWithoutDeliveryAddressInputSchema),z.lazy(() => OrderUncheckedUpdateWithoutDeliveryAddressInputSchema) ]),
}).strict();

export const OrderUpdateManyWithWhereWithoutDeliveryAddressInputSchema: z.ZodType<Prisma.OrderUpdateManyWithWhereWithoutDeliveryAddressInput> = z.object({
  where: z.lazy(() => OrderScalarWhereInputSchema),
  data: z.union([ z.lazy(() => OrderUpdateManyMutationInputSchema),z.lazy(() => OrderUncheckedUpdateManyWithoutDeliveryAddressInputSchema) ]),
}).strict();

export const OrderScalarWhereInputSchema: z.ZodType<Prisma.OrderScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => OrderScalarWhereInputSchema),z.lazy(() => OrderScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrderScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrderScalarWhereInputSchema),z.lazy(() => OrderScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  transporterId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  promoCodeId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  totalCents: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  currency: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  paymentMethod: z.union([ z.lazy(() => EnumPaymentMethodFilterSchema),z.lazy(() => PaymentMethodSchema) ]).optional(),
  deliveryNeeded: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  status: z.union([ z.lazy(() => EnumOrderStatusFilterSchema),z.lazy(() => OrderStatusSchema) ]).optional(),
  PaymobOrderId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  deliveryAddressId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  deliveredAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const CartItemCreateWithoutCartInputSchema: z.ZodType<Prisma.CartItemCreateWithoutCartInput> = z.object({
  id: z.string().uuid().optional(),
  quantity: z.number().int(),
  product: z.lazy(() => ProductCreateNestedOneWithoutCartItemInputSchema)
}).strict();

export const CartItemUncheckedCreateWithoutCartInputSchema: z.ZodType<Prisma.CartItemUncheckedCreateWithoutCartInput> = z.object({
  id: z.string().uuid().optional(),
  productId: z.string(),
  quantity: z.number().int()
}).strict();

export const CartItemCreateOrConnectWithoutCartInputSchema: z.ZodType<Prisma.CartItemCreateOrConnectWithoutCartInput> = z.object({
  where: z.lazy(() => CartItemWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CartItemCreateWithoutCartInputSchema),z.lazy(() => CartItemUncheckedCreateWithoutCartInputSchema) ]),
}).strict();

export const CartItemCreateManyCartInputEnvelopeSchema: z.ZodType<Prisma.CartItemCreateManyCartInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => CartItemCreateManyCartInputSchema),z.lazy(() => CartItemCreateManyCartInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const PromoCodeCreateWithoutCartInputSchema: z.ZodType<Prisma.PromoCodeCreateWithoutCartInput> = z.object({
  id: z.string().uuid().optional(),
  code: z.string(),
  description: z.string(),
  discountPercent: z.number().int(),
  maxDiscountCents: z.number().int(),
  validFrom: z.coerce.date(),
  validUntil: z.coerce.date(),
  Order: z.lazy(() => OrderCreateNestedManyWithoutPromoCodeInputSchema).optional()
}).strict();

export const PromoCodeUncheckedCreateWithoutCartInputSchema: z.ZodType<Prisma.PromoCodeUncheckedCreateWithoutCartInput> = z.object({
  id: z.string().uuid().optional(),
  code: z.string(),
  description: z.string(),
  discountPercent: z.number().int(),
  maxDiscountCents: z.number().int(),
  validFrom: z.coerce.date(),
  validUntil: z.coerce.date(),
  Order: z.lazy(() => OrderUncheckedCreateNestedManyWithoutPromoCodeInputSchema).optional()
}).strict();

export const PromoCodeCreateOrConnectWithoutCartInputSchema: z.ZodType<Prisma.PromoCodeCreateOrConnectWithoutCartInput> = z.object({
  where: z.lazy(() => PromoCodeWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PromoCodeCreateWithoutCartInputSchema),z.lazy(() => PromoCodeUncheckedCreateWithoutCartInputSchema) ]),
}).strict();

export const UserCreateWithoutCartInputSchema: z.ZodType<Prisma.UserCreateWithoutCartInput> = z.object({
  id: z.string().uuid().optional(),
  email: z.string(),
  emailVerified: z.boolean().optional(),
  passwordHash: z.string(),
  name: z.string(),
  gender: z.lazy(() => GenderSchema),
  dob: z.coerce.date(),
  phone: z.string().optional().nullable(),
  phoneVerified: z.boolean().optional(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  addresses: z.lazy(() => AddressCreateNestedManyWithoutUserInputSchema).optional(),
  wishlist: z.lazy(() => ProductCreateNestedManyWithoutWishersInputSchema).optional(),
  orders: z.lazy(() => OrderCreateNestedManyWithoutUserInputSchema).optional(),
  returns: z.lazy(() => ReturnCreateNestedManyWithoutUserInputSchema).optional(),
  orderTranports: z.lazy(() => OrderCreateNestedManyWithoutTransporterInputSchema).optional(),
  returnTransports: z.lazy(() => ReturnCreateNestedManyWithoutTransporterInputSchema).optional(),
  Review: z.lazy(() => ReviewCreateNestedManyWithoutUserInputSchema).optional(),
  search: z.lazy(() => searchCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutCartInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutCartInput> = z.object({
  id: z.string().uuid().optional(),
  email: z.string(),
  emailVerified: z.boolean().optional(),
  passwordHash: z.string(),
  name: z.string(),
  gender: z.lazy(() => GenderSchema),
  dob: z.coerce.date(),
  phone: z.string().optional().nullable(),
  phoneVerified: z.boolean().optional(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  addresses: z.lazy(() => AddressUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  wishlist: z.lazy(() => ProductUncheckedCreateNestedManyWithoutWishersInputSchema).optional(),
  orders: z.lazy(() => OrderUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  returns: z.lazy(() => ReturnUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  orderTranports: z.lazy(() => OrderUncheckedCreateNestedManyWithoutTransporterInputSchema).optional(),
  returnTransports: z.lazy(() => ReturnUncheckedCreateNestedManyWithoutTransporterInputSchema).optional(),
  Review: z.lazy(() => ReviewUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  search: z.lazy(() => searchUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutCartInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutCartInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutCartInputSchema),z.lazy(() => UserUncheckedCreateWithoutCartInputSchema) ]),
}).strict();

export const CartItemUpsertWithWhereUniqueWithoutCartInputSchema: z.ZodType<Prisma.CartItemUpsertWithWhereUniqueWithoutCartInput> = z.object({
  where: z.lazy(() => CartItemWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CartItemUpdateWithoutCartInputSchema),z.lazy(() => CartItemUncheckedUpdateWithoutCartInputSchema) ]),
  create: z.union([ z.lazy(() => CartItemCreateWithoutCartInputSchema),z.lazy(() => CartItemUncheckedCreateWithoutCartInputSchema) ]),
}).strict();

export const CartItemUpdateWithWhereUniqueWithoutCartInputSchema: z.ZodType<Prisma.CartItemUpdateWithWhereUniqueWithoutCartInput> = z.object({
  where: z.lazy(() => CartItemWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CartItemUpdateWithoutCartInputSchema),z.lazy(() => CartItemUncheckedUpdateWithoutCartInputSchema) ]),
}).strict();

export const CartItemUpdateManyWithWhereWithoutCartInputSchema: z.ZodType<Prisma.CartItemUpdateManyWithWhereWithoutCartInput> = z.object({
  where: z.lazy(() => CartItemScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CartItemUpdateManyMutationInputSchema),z.lazy(() => CartItemUncheckedUpdateManyWithoutCartInputSchema) ]),
}).strict();

export const CartItemScalarWhereInputSchema: z.ZodType<Prisma.CartItemScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CartItemScalarWhereInputSchema),z.lazy(() => CartItemScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CartItemScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CartItemScalarWhereInputSchema),z.lazy(() => CartItemScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  productId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  quantity: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  cartId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const PromoCodeUpsertWithoutCartInputSchema: z.ZodType<Prisma.PromoCodeUpsertWithoutCartInput> = z.object({
  update: z.union([ z.lazy(() => PromoCodeUpdateWithoutCartInputSchema),z.lazy(() => PromoCodeUncheckedUpdateWithoutCartInputSchema) ]),
  create: z.union([ z.lazy(() => PromoCodeCreateWithoutCartInputSchema),z.lazy(() => PromoCodeUncheckedCreateWithoutCartInputSchema) ]),
  where: z.lazy(() => PromoCodeWhereInputSchema).optional()
}).strict();

export const PromoCodeUpdateToOneWithWhereWithoutCartInputSchema: z.ZodType<Prisma.PromoCodeUpdateToOneWithWhereWithoutCartInput> = z.object({
  where: z.lazy(() => PromoCodeWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PromoCodeUpdateWithoutCartInputSchema),z.lazy(() => PromoCodeUncheckedUpdateWithoutCartInputSchema) ]),
}).strict();

export const PromoCodeUpdateWithoutCartInputSchema: z.ZodType<Prisma.PromoCodeUpdateWithoutCartInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  discountPercent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  maxDiscountCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  validFrom: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  validUntil: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Order: z.lazy(() => OrderUpdateManyWithoutPromoCodeNestedInputSchema).optional()
}).strict();

export const PromoCodeUncheckedUpdateWithoutCartInputSchema: z.ZodType<Prisma.PromoCodeUncheckedUpdateWithoutCartInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  discountPercent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  maxDiscountCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  validFrom: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  validUntil: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Order: z.lazy(() => OrderUncheckedUpdateManyWithoutPromoCodeNestedInputSchema).optional()
}).strict();

export const UserUpsertWithoutCartInputSchema: z.ZodType<Prisma.UserUpsertWithoutCartInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutCartInputSchema),z.lazy(() => UserUncheckedUpdateWithoutCartInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutCartInputSchema),z.lazy(() => UserUncheckedCreateWithoutCartInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutCartInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutCartInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutCartInputSchema),z.lazy(() => UserUncheckedUpdateWithoutCartInputSchema) ]),
}).strict();

export const UserUpdateWithoutCartInputSchema: z.ZodType<Prisma.UserUpdateWithoutCartInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  passwordHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => GenderSchema),z.lazy(() => EnumGenderFieldUpdateOperationsInputSchema) ]).optional(),
  dob: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  addresses: z.lazy(() => AddressUpdateManyWithoutUserNestedInputSchema).optional(),
  wishlist: z.lazy(() => ProductUpdateManyWithoutWishersNestedInputSchema).optional(),
  orders: z.lazy(() => OrderUpdateManyWithoutUserNestedInputSchema).optional(),
  returns: z.lazy(() => ReturnUpdateManyWithoutUserNestedInputSchema).optional(),
  orderTranports: z.lazy(() => OrderUpdateManyWithoutTransporterNestedInputSchema).optional(),
  returnTransports: z.lazy(() => ReturnUpdateManyWithoutTransporterNestedInputSchema).optional(),
  Review: z.lazy(() => ReviewUpdateManyWithoutUserNestedInputSchema).optional(),
  search: z.lazy(() => searchUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutCartInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutCartInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  passwordHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => GenderSchema),z.lazy(() => EnumGenderFieldUpdateOperationsInputSchema) ]).optional(),
  dob: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  addresses: z.lazy(() => AddressUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  wishlist: z.lazy(() => ProductUncheckedUpdateManyWithoutWishersNestedInputSchema).optional(),
  orders: z.lazy(() => OrderUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  returns: z.lazy(() => ReturnUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  orderTranports: z.lazy(() => OrderUncheckedUpdateManyWithoutTransporterNestedInputSchema).optional(),
  returnTransports: z.lazy(() => ReturnUncheckedUpdateManyWithoutTransporterNestedInputSchema).optional(),
  Review: z.lazy(() => ReviewUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  search: z.lazy(() => searchUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const ProductCreateWithoutCartItemInputSchema: z.ZodType<Prisma.ProductCreateWithoutCartItemInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  sku: z.string(),
  description: z.string(),
  stock: z.number().int().optional(),
  views: z.number().int().optional(),
  priceCents: z.number().int().optional(),
  salePercent: z.number().int().optional(),
  warrantyDays: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  reviews: z.lazy(() => ReviewCreateNestedManyWithoutProductInputSchema).optional(),
  category: z.lazy(() => CategoryCreateNestedOneWithoutProductsInputSchema),
  wishers: z.lazy(() => UserCreateNestedManyWithoutWishlistInputSchema).optional(),
  OrderItem: z.lazy(() => OrderItemCreateNestedManyWithoutProductInputSchema).optional()
}).strict();

export const ProductUncheckedCreateWithoutCartItemInputSchema: z.ZodType<Prisma.ProductUncheckedCreateWithoutCartItemInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  sku: z.string(),
  description: z.string(),
  stock: z.number().int().optional(),
  views: z.number().int().optional(),
  priceCents: z.number().int().optional(),
  salePercent: z.number().int().optional(),
  warrantyDays: z.number().int().optional(),
  categoryId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  reviews: z.lazy(() => ReviewUncheckedCreateNestedManyWithoutProductInputSchema).optional(),
  wishers: z.lazy(() => UserUncheckedCreateNestedManyWithoutWishlistInputSchema).optional(),
  OrderItem: z.lazy(() => OrderItemUncheckedCreateNestedManyWithoutProductInputSchema).optional()
}).strict();

export const ProductCreateOrConnectWithoutCartItemInputSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutCartItemInput> = z.object({
  where: z.lazy(() => ProductWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProductCreateWithoutCartItemInputSchema),z.lazy(() => ProductUncheckedCreateWithoutCartItemInputSchema) ]),
}).strict();

export const CartCreateWithoutCartItemsInputSchema: z.ZodType<Prisma.CartCreateWithoutCartItemsInput> = z.object({
  id: z.string().uuid().optional(),
  promoCode: z.lazy(() => PromoCodeCreateNestedOneWithoutCartInputSchema).optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutCartInputSchema).optional()
}).strict();

export const CartUncheckedCreateWithoutCartItemsInputSchema: z.ZodType<Prisma.CartUncheckedCreateWithoutCartItemsInput> = z.object({
  id: z.string().uuid().optional(),
  promoCodeId: z.string().optional().nullable(),
  user: z.lazy(() => UserUncheckedCreateNestedOneWithoutCartInputSchema).optional()
}).strict();

export const CartCreateOrConnectWithoutCartItemsInputSchema: z.ZodType<Prisma.CartCreateOrConnectWithoutCartItemsInput> = z.object({
  where: z.lazy(() => CartWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CartCreateWithoutCartItemsInputSchema),z.lazy(() => CartUncheckedCreateWithoutCartItemsInputSchema) ]),
}).strict();

export const ProductUpsertWithoutCartItemInputSchema: z.ZodType<Prisma.ProductUpsertWithoutCartItemInput> = z.object({
  update: z.union([ z.lazy(() => ProductUpdateWithoutCartItemInputSchema),z.lazy(() => ProductUncheckedUpdateWithoutCartItemInputSchema) ]),
  create: z.union([ z.lazy(() => ProductCreateWithoutCartItemInputSchema),z.lazy(() => ProductUncheckedCreateWithoutCartItemInputSchema) ]),
  where: z.lazy(() => ProductWhereInputSchema).optional()
}).strict();

export const ProductUpdateToOneWithWhereWithoutCartItemInputSchema: z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutCartItemInput> = z.object({
  where: z.lazy(() => ProductWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ProductUpdateWithoutCartItemInputSchema),z.lazy(() => ProductUncheckedUpdateWithoutCartItemInputSchema) ]),
}).strict();

export const ProductUpdateWithoutCartItemInputSchema: z.ZodType<Prisma.ProductUpdateWithoutCartItemInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sku: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stock: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  views: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  priceCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  salePercent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  warrantyDays: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  reviews: z.lazy(() => ReviewUpdateManyWithoutProductNestedInputSchema).optional(),
  category: z.lazy(() => CategoryUpdateOneRequiredWithoutProductsNestedInputSchema).optional(),
  wishers: z.lazy(() => UserUpdateManyWithoutWishlistNestedInputSchema).optional(),
  OrderItem: z.lazy(() => OrderItemUpdateManyWithoutProductNestedInputSchema).optional()
}).strict();

export const ProductUncheckedUpdateWithoutCartItemInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateWithoutCartItemInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sku: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stock: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  views: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  priceCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  salePercent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  warrantyDays: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  categoryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  reviews: z.lazy(() => ReviewUncheckedUpdateManyWithoutProductNestedInputSchema).optional(),
  wishers: z.lazy(() => UserUncheckedUpdateManyWithoutWishlistNestedInputSchema).optional(),
  OrderItem: z.lazy(() => OrderItemUncheckedUpdateManyWithoutProductNestedInputSchema).optional()
}).strict();

export const CartUpsertWithoutCartItemsInputSchema: z.ZodType<Prisma.CartUpsertWithoutCartItemsInput> = z.object({
  update: z.union([ z.lazy(() => CartUpdateWithoutCartItemsInputSchema),z.lazy(() => CartUncheckedUpdateWithoutCartItemsInputSchema) ]),
  create: z.union([ z.lazy(() => CartCreateWithoutCartItemsInputSchema),z.lazy(() => CartUncheckedCreateWithoutCartItemsInputSchema) ]),
  where: z.lazy(() => CartWhereInputSchema).optional()
}).strict();

export const CartUpdateToOneWithWhereWithoutCartItemsInputSchema: z.ZodType<Prisma.CartUpdateToOneWithWhereWithoutCartItemsInput> = z.object({
  where: z.lazy(() => CartWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CartUpdateWithoutCartItemsInputSchema),z.lazy(() => CartUncheckedUpdateWithoutCartItemsInputSchema) ]),
}).strict();

export const CartUpdateWithoutCartItemsInputSchema: z.ZodType<Prisma.CartUpdateWithoutCartItemsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promoCode: z.lazy(() => PromoCodeUpdateOneWithoutCartNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneWithoutCartNestedInputSchema).optional()
}).strict();

export const CartUncheckedUpdateWithoutCartItemsInputSchema: z.ZodType<Prisma.CartUncheckedUpdateWithoutCartItemsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promoCodeId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user: z.lazy(() => UserUncheckedUpdateOneWithoutCartNestedInputSchema).optional()
}).strict();

export const ProductCreateWithoutCategoryInputSchema: z.ZodType<Prisma.ProductCreateWithoutCategoryInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  sku: z.string(),
  description: z.string(),
  stock: z.number().int().optional(),
  views: z.number().int().optional(),
  priceCents: z.number().int().optional(),
  salePercent: z.number().int().optional(),
  warrantyDays: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  reviews: z.lazy(() => ReviewCreateNestedManyWithoutProductInputSchema).optional(),
  wishers: z.lazy(() => UserCreateNestedManyWithoutWishlistInputSchema).optional(),
  CartItem: z.lazy(() => CartItemCreateNestedManyWithoutProductInputSchema).optional(),
  OrderItem: z.lazy(() => OrderItemCreateNestedManyWithoutProductInputSchema).optional()
}).strict();

export const ProductUncheckedCreateWithoutCategoryInputSchema: z.ZodType<Prisma.ProductUncheckedCreateWithoutCategoryInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  sku: z.string(),
  description: z.string(),
  stock: z.number().int().optional(),
  views: z.number().int().optional(),
  priceCents: z.number().int().optional(),
  salePercent: z.number().int().optional(),
  warrantyDays: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  reviews: z.lazy(() => ReviewUncheckedCreateNestedManyWithoutProductInputSchema).optional(),
  wishers: z.lazy(() => UserUncheckedCreateNestedManyWithoutWishlistInputSchema).optional(),
  CartItem: z.lazy(() => CartItemUncheckedCreateNestedManyWithoutProductInputSchema).optional(),
  OrderItem: z.lazy(() => OrderItemUncheckedCreateNestedManyWithoutProductInputSchema).optional()
}).strict();

export const ProductCreateOrConnectWithoutCategoryInputSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutCategoryInput> = z.object({
  where: z.lazy(() => ProductWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProductCreateWithoutCategoryInputSchema),z.lazy(() => ProductUncheckedCreateWithoutCategoryInputSchema) ]),
}).strict();

export const ProductCreateManyCategoryInputEnvelopeSchema: z.ZodType<Prisma.ProductCreateManyCategoryInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ProductCreateManyCategoryInputSchema),z.lazy(() => ProductCreateManyCategoryInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const searchCreateWithoutCategoryInputSchema: z.ZodType<Prisma.searchCreateWithoutCategoryInput> = z.object({
  id: z.string().uuid().optional(),
  keyWord: z.string(),
  user: z.lazy(() => UserCreateNestedOneWithoutSearchInputSchema).optional()
}).strict();

export const searchUncheckedCreateWithoutCategoryInputSchema: z.ZodType<Prisma.searchUncheckedCreateWithoutCategoryInput> = z.object({
  id: z.string().uuid().optional(),
  keyWord: z.string(),
  userId: z.string().optional().nullable()
}).strict();

export const searchCreateOrConnectWithoutCategoryInputSchema: z.ZodType<Prisma.searchCreateOrConnectWithoutCategoryInput> = z.object({
  where: z.lazy(() => searchWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => searchCreateWithoutCategoryInputSchema),z.lazy(() => searchUncheckedCreateWithoutCategoryInputSchema) ]),
}).strict();

export const searchCreateManyCategoryInputEnvelopeSchema: z.ZodType<Prisma.searchCreateManyCategoryInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => searchCreateManyCategoryInputSchema),z.lazy(() => searchCreateManyCategoryInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ProductUpsertWithWhereUniqueWithoutCategoryInputSchema: z.ZodType<Prisma.ProductUpsertWithWhereUniqueWithoutCategoryInput> = z.object({
  where: z.lazy(() => ProductWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ProductUpdateWithoutCategoryInputSchema),z.lazy(() => ProductUncheckedUpdateWithoutCategoryInputSchema) ]),
  create: z.union([ z.lazy(() => ProductCreateWithoutCategoryInputSchema),z.lazy(() => ProductUncheckedCreateWithoutCategoryInputSchema) ]),
}).strict();

export const ProductUpdateWithWhereUniqueWithoutCategoryInputSchema: z.ZodType<Prisma.ProductUpdateWithWhereUniqueWithoutCategoryInput> = z.object({
  where: z.lazy(() => ProductWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ProductUpdateWithoutCategoryInputSchema),z.lazy(() => ProductUncheckedUpdateWithoutCategoryInputSchema) ]),
}).strict();

export const ProductUpdateManyWithWhereWithoutCategoryInputSchema: z.ZodType<Prisma.ProductUpdateManyWithWhereWithoutCategoryInput> = z.object({
  where: z.lazy(() => ProductScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ProductUpdateManyMutationInputSchema),z.lazy(() => ProductUncheckedUpdateManyWithoutCategoryInputSchema) ]),
}).strict();

export const ProductScalarWhereInputSchema: z.ZodType<Prisma.ProductScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProductScalarWhereInputSchema),z.lazy(() => ProductScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProductScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProductScalarWhereInputSchema),z.lazy(() => ProductScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  sku: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  stock: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  views: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  priceCents: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  salePercent: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  warrantyDays: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  categoryId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  deleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
}).strict();

export const searchUpsertWithWhereUniqueWithoutCategoryInputSchema: z.ZodType<Prisma.searchUpsertWithWhereUniqueWithoutCategoryInput> = z.object({
  where: z.lazy(() => searchWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => searchUpdateWithoutCategoryInputSchema),z.lazy(() => searchUncheckedUpdateWithoutCategoryInputSchema) ]),
  create: z.union([ z.lazy(() => searchCreateWithoutCategoryInputSchema),z.lazy(() => searchUncheckedCreateWithoutCategoryInputSchema) ]),
}).strict();

export const searchUpdateWithWhereUniqueWithoutCategoryInputSchema: z.ZodType<Prisma.searchUpdateWithWhereUniqueWithoutCategoryInput> = z.object({
  where: z.lazy(() => searchWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => searchUpdateWithoutCategoryInputSchema),z.lazy(() => searchUncheckedUpdateWithoutCategoryInputSchema) ]),
}).strict();

export const searchUpdateManyWithWhereWithoutCategoryInputSchema: z.ZodType<Prisma.searchUpdateManyWithWhereWithoutCategoryInput> = z.object({
  where: z.lazy(() => searchScalarWhereInputSchema),
  data: z.union([ z.lazy(() => searchUpdateManyMutationInputSchema),z.lazy(() => searchUncheckedUpdateManyWithoutCategoryInputSchema) ]),
}).strict();

export const searchScalarWhereInputSchema: z.ZodType<Prisma.searchScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => searchScalarWhereInputSchema),z.lazy(() => searchScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => searchScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => searchScalarWhereInputSchema),z.lazy(() => searchScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  keyWord: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  categoryId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const UserCreateWithoutOrdersInputSchema: z.ZodType<Prisma.UserCreateWithoutOrdersInput> = z.object({
  id: z.string().uuid().optional(),
  email: z.string(),
  emailVerified: z.boolean().optional(),
  passwordHash: z.string(),
  name: z.string(),
  gender: z.lazy(() => GenderSchema),
  dob: z.coerce.date(),
  phone: z.string().optional().nullable(),
  phoneVerified: z.boolean().optional(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  cart: z.lazy(() => CartCreateNestedOneWithoutUserInputSchema),
  addresses: z.lazy(() => AddressCreateNestedManyWithoutUserInputSchema).optional(),
  wishlist: z.lazy(() => ProductCreateNestedManyWithoutWishersInputSchema).optional(),
  returns: z.lazy(() => ReturnCreateNestedManyWithoutUserInputSchema).optional(),
  orderTranports: z.lazy(() => OrderCreateNestedManyWithoutTransporterInputSchema).optional(),
  returnTransports: z.lazy(() => ReturnCreateNestedManyWithoutTransporterInputSchema).optional(),
  Review: z.lazy(() => ReviewCreateNestedManyWithoutUserInputSchema).optional(),
  search: z.lazy(() => searchCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutOrdersInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutOrdersInput> = z.object({
  id: z.string().uuid().optional(),
  email: z.string(),
  emailVerified: z.boolean().optional(),
  passwordHash: z.string(),
  name: z.string(),
  gender: z.lazy(() => GenderSchema),
  dob: z.coerce.date(),
  phone: z.string().optional().nullable(),
  phoneVerified: z.boolean().optional(),
  role: z.lazy(() => RoleSchema).optional(),
  cartId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  addresses: z.lazy(() => AddressUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  wishlist: z.lazy(() => ProductUncheckedCreateNestedManyWithoutWishersInputSchema).optional(),
  returns: z.lazy(() => ReturnUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  orderTranports: z.lazy(() => OrderUncheckedCreateNestedManyWithoutTransporterInputSchema).optional(),
  returnTransports: z.lazy(() => ReturnUncheckedCreateNestedManyWithoutTransporterInputSchema).optional(),
  Review: z.lazy(() => ReviewUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  search: z.lazy(() => searchUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutOrdersInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutOrdersInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutOrdersInputSchema),z.lazy(() => UserUncheckedCreateWithoutOrdersInputSchema) ]),
}).strict();

export const UserCreateWithoutOrderTranportsInputSchema: z.ZodType<Prisma.UserCreateWithoutOrderTranportsInput> = z.object({
  id: z.string().uuid().optional(),
  email: z.string(),
  emailVerified: z.boolean().optional(),
  passwordHash: z.string(),
  name: z.string(),
  gender: z.lazy(() => GenderSchema),
  dob: z.coerce.date(),
  phone: z.string().optional().nullable(),
  phoneVerified: z.boolean().optional(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  cart: z.lazy(() => CartCreateNestedOneWithoutUserInputSchema),
  addresses: z.lazy(() => AddressCreateNestedManyWithoutUserInputSchema).optional(),
  wishlist: z.lazy(() => ProductCreateNestedManyWithoutWishersInputSchema).optional(),
  orders: z.lazy(() => OrderCreateNestedManyWithoutUserInputSchema).optional(),
  returns: z.lazy(() => ReturnCreateNestedManyWithoutUserInputSchema).optional(),
  returnTransports: z.lazy(() => ReturnCreateNestedManyWithoutTransporterInputSchema).optional(),
  Review: z.lazy(() => ReviewCreateNestedManyWithoutUserInputSchema).optional(),
  search: z.lazy(() => searchCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutOrderTranportsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutOrderTranportsInput> = z.object({
  id: z.string().uuid().optional(),
  email: z.string(),
  emailVerified: z.boolean().optional(),
  passwordHash: z.string(),
  name: z.string(),
  gender: z.lazy(() => GenderSchema),
  dob: z.coerce.date(),
  phone: z.string().optional().nullable(),
  phoneVerified: z.boolean().optional(),
  role: z.lazy(() => RoleSchema).optional(),
  cartId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  addresses: z.lazy(() => AddressUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  wishlist: z.lazy(() => ProductUncheckedCreateNestedManyWithoutWishersInputSchema).optional(),
  orders: z.lazy(() => OrderUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  returns: z.lazy(() => ReturnUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  returnTransports: z.lazy(() => ReturnUncheckedCreateNestedManyWithoutTransporterInputSchema).optional(),
  Review: z.lazy(() => ReviewUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  search: z.lazy(() => searchUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutOrderTranportsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutOrderTranportsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutOrderTranportsInputSchema),z.lazy(() => UserUncheckedCreateWithoutOrderTranportsInputSchema) ]),
}).strict();

export const OrderItemCreateWithoutOrderInputSchema: z.ZodType<Prisma.OrderItemCreateWithoutOrderInput> = z.object({
  productPriceCents: z.number().int(),
  productSalePercent: z.number().int(),
  quantity: z.number().int(),
  warrantyDays: z.number().int(),
  product: z.lazy(() => ProductCreateNestedOneWithoutOrderItemInputSchema)
}).strict();

export const OrderItemUncheckedCreateWithoutOrderInputSchema: z.ZodType<Prisma.OrderItemUncheckedCreateWithoutOrderInput> = z.object({
  productId: z.string(),
  productPriceCents: z.number().int(),
  productSalePercent: z.number().int(),
  quantity: z.number().int(),
  warrantyDays: z.number().int()
}).strict();

export const OrderItemCreateOrConnectWithoutOrderInputSchema: z.ZodType<Prisma.OrderItemCreateOrConnectWithoutOrderInput> = z.object({
  where: z.lazy(() => OrderItemWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrderItemCreateWithoutOrderInputSchema),z.lazy(() => OrderItemUncheckedCreateWithoutOrderInputSchema) ]),
}).strict();

export const OrderItemCreateManyOrderInputEnvelopeSchema: z.ZodType<Prisma.OrderItemCreateManyOrderInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => OrderItemCreateManyOrderInputSchema),z.lazy(() => OrderItemCreateManyOrderInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const PromoCodeCreateWithoutOrderInputSchema: z.ZodType<Prisma.PromoCodeCreateWithoutOrderInput> = z.object({
  id: z.string().uuid().optional(),
  code: z.string(),
  description: z.string(),
  discountPercent: z.number().int(),
  maxDiscountCents: z.number().int(),
  validFrom: z.coerce.date(),
  validUntil: z.coerce.date(),
  cart: z.lazy(() => CartCreateNestedManyWithoutPromoCodeInputSchema).optional()
}).strict();

export const PromoCodeUncheckedCreateWithoutOrderInputSchema: z.ZodType<Prisma.PromoCodeUncheckedCreateWithoutOrderInput> = z.object({
  id: z.string().uuid().optional(),
  code: z.string(),
  description: z.string(),
  discountPercent: z.number().int(),
  maxDiscountCents: z.number().int(),
  validFrom: z.coerce.date(),
  validUntil: z.coerce.date(),
  cart: z.lazy(() => CartUncheckedCreateNestedManyWithoutPromoCodeInputSchema).optional()
}).strict();

export const PromoCodeCreateOrConnectWithoutOrderInputSchema: z.ZodType<Prisma.PromoCodeCreateOrConnectWithoutOrderInput> = z.object({
  where: z.lazy(() => PromoCodeWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PromoCodeCreateWithoutOrderInputSchema),z.lazy(() => PromoCodeUncheckedCreateWithoutOrderInputSchema) ]),
}).strict();

export const AddressCreateWithoutOrderInputSchema: z.ZodType<Prisma.AddressCreateWithoutOrderInput> = z.object({
  id: z.string().uuid().optional(),
  apartment: z.string(),
  floor: z.string(),
  building: z.string(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  postalCode: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutAddressesInputSchema)
}).strict();

export const AddressUncheckedCreateWithoutOrderInputSchema: z.ZodType<Prisma.AddressUncheckedCreateWithoutOrderInput> = z.object({
  id: z.string().uuid().optional(),
  apartment: z.string(),
  floor: z.string(),
  building: z.string(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  postalCode: z.string(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const AddressCreateOrConnectWithoutOrderInputSchema: z.ZodType<Prisma.AddressCreateOrConnectWithoutOrderInput> = z.object({
  where: z.lazy(() => AddressWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AddressCreateWithoutOrderInputSchema),z.lazy(() => AddressUncheckedCreateWithoutOrderInputSchema) ]),
}).strict();

export const UserUpsertWithoutOrdersInputSchema: z.ZodType<Prisma.UserUpsertWithoutOrdersInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutOrdersInputSchema),z.lazy(() => UserUncheckedUpdateWithoutOrdersInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutOrdersInputSchema),z.lazy(() => UserUncheckedCreateWithoutOrdersInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutOrdersInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutOrdersInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutOrdersInputSchema),z.lazy(() => UserUncheckedUpdateWithoutOrdersInputSchema) ]),
}).strict();

export const UserUpdateWithoutOrdersInputSchema: z.ZodType<Prisma.UserUpdateWithoutOrdersInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  passwordHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => GenderSchema),z.lazy(() => EnumGenderFieldUpdateOperationsInputSchema) ]).optional(),
  dob: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cart: z.lazy(() => CartUpdateOneRequiredWithoutUserNestedInputSchema).optional(),
  addresses: z.lazy(() => AddressUpdateManyWithoutUserNestedInputSchema).optional(),
  wishlist: z.lazy(() => ProductUpdateManyWithoutWishersNestedInputSchema).optional(),
  returns: z.lazy(() => ReturnUpdateManyWithoutUserNestedInputSchema).optional(),
  orderTranports: z.lazy(() => OrderUpdateManyWithoutTransporterNestedInputSchema).optional(),
  returnTransports: z.lazy(() => ReturnUpdateManyWithoutTransporterNestedInputSchema).optional(),
  Review: z.lazy(() => ReviewUpdateManyWithoutUserNestedInputSchema).optional(),
  search: z.lazy(() => searchUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutOrdersInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutOrdersInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  passwordHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => GenderSchema),z.lazy(() => EnumGenderFieldUpdateOperationsInputSchema) ]).optional(),
  dob: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  cartId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  addresses: z.lazy(() => AddressUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  wishlist: z.lazy(() => ProductUncheckedUpdateManyWithoutWishersNestedInputSchema).optional(),
  returns: z.lazy(() => ReturnUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  orderTranports: z.lazy(() => OrderUncheckedUpdateManyWithoutTransporterNestedInputSchema).optional(),
  returnTransports: z.lazy(() => ReturnUncheckedUpdateManyWithoutTransporterNestedInputSchema).optional(),
  Review: z.lazy(() => ReviewUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  search: z.lazy(() => searchUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUpsertWithoutOrderTranportsInputSchema: z.ZodType<Prisma.UserUpsertWithoutOrderTranportsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutOrderTranportsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutOrderTranportsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutOrderTranportsInputSchema),z.lazy(() => UserUncheckedCreateWithoutOrderTranportsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutOrderTranportsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutOrderTranportsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutOrderTranportsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutOrderTranportsInputSchema) ]),
}).strict();

export const UserUpdateWithoutOrderTranportsInputSchema: z.ZodType<Prisma.UserUpdateWithoutOrderTranportsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  passwordHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => GenderSchema),z.lazy(() => EnumGenderFieldUpdateOperationsInputSchema) ]).optional(),
  dob: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cart: z.lazy(() => CartUpdateOneRequiredWithoutUserNestedInputSchema).optional(),
  addresses: z.lazy(() => AddressUpdateManyWithoutUserNestedInputSchema).optional(),
  wishlist: z.lazy(() => ProductUpdateManyWithoutWishersNestedInputSchema).optional(),
  orders: z.lazy(() => OrderUpdateManyWithoutUserNestedInputSchema).optional(),
  returns: z.lazy(() => ReturnUpdateManyWithoutUserNestedInputSchema).optional(),
  returnTransports: z.lazy(() => ReturnUpdateManyWithoutTransporterNestedInputSchema).optional(),
  Review: z.lazy(() => ReviewUpdateManyWithoutUserNestedInputSchema).optional(),
  search: z.lazy(() => searchUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutOrderTranportsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutOrderTranportsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  passwordHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => GenderSchema),z.lazy(() => EnumGenderFieldUpdateOperationsInputSchema) ]).optional(),
  dob: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  cartId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  addresses: z.lazy(() => AddressUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  wishlist: z.lazy(() => ProductUncheckedUpdateManyWithoutWishersNestedInputSchema).optional(),
  orders: z.lazy(() => OrderUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  returns: z.lazy(() => ReturnUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  returnTransports: z.lazy(() => ReturnUncheckedUpdateManyWithoutTransporterNestedInputSchema).optional(),
  Review: z.lazy(() => ReviewUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  search: z.lazy(() => searchUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const OrderItemUpsertWithWhereUniqueWithoutOrderInputSchema: z.ZodType<Prisma.OrderItemUpsertWithWhereUniqueWithoutOrderInput> = z.object({
  where: z.lazy(() => OrderItemWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => OrderItemUpdateWithoutOrderInputSchema),z.lazy(() => OrderItemUncheckedUpdateWithoutOrderInputSchema) ]),
  create: z.union([ z.lazy(() => OrderItemCreateWithoutOrderInputSchema),z.lazy(() => OrderItemUncheckedCreateWithoutOrderInputSchema) ]),
}).strict();

export const OrderItemUpdateWithWhereUniqueWithoutOrderInputSchema: z.ZodType<Prisma.OrderItemUpdateWithWhereUniqueWithoutOrderInput> = z.object({
  where: z.lazy(() => OrderItemWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => OrderItemUpdateWithoutOrderInputSchema),z.lazy(() => OrderItemUncheckedUpdateWithoutOrderInputSchema) ]),
}).strict();

export const OrderItemUpdateManyWithWhereWithoutOrderInputSchema: z.ZodType<Prisma.OrderItemUpdateManyWithWhereWithoutOrderInput> = z.object({
  where: z.lazy(() => OrderItemScalarWhereInputSchema),
  data: z.union([ z.lazy(() => OrderItemUpdateManyMutationInputSchema),z.lazy(() => OrderItemUncheckedUpdateManyWithoutOrderInputSchema) ]),
}).strict();

export const OrderItemScalarWhereInputSchema: z.ZodType<Prisma.OrderItemScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => OrderItemScalarWhereInputSchema),z.lazy(() => OrderItemScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrderItemScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrderItemScalarWhereInputSchema),z.lazy(() => OrderItemScalarWhereInputSchema).array() ]).optional(),
  orderId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  productId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  productPriceCents: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  productSalePercent: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  quantity: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  warrantyDays: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
}).strict();

export const PromoCodeUpsertWithoutOrderInputSchema: z.ZodType<Prisma.PromoCodeUpsertWithoutOrderInput> = z.object({
  update: z.union([ z.lazy(() => PromoCodeUpdateWithoutOrderInputSchema),z.lazy(() => PromoCodeUncheckedUpdateWithoutOrderInputSchema) ]),
  create: z.union([ z.lazy(() => PromoCodeCreateWithoutOrderInputSchema),z.lazy(() => PromoCodeUncheckedCreateWithoutOrderInputSchema) ]),
  where: z.lazy(() => PromoCodeWhereInputSchema).optional()
}).strict();

export const PromoCodeUpdateToOneWithWhereWithoutOrderInputSchema: z.ZodType<Prisma.PromoCodeUpdateToOneWithWhereWithoutOrderInput> = z.object({
  where: z.lazy(() => PromoCodeWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PromoCodeUpdateWithoutOrderInputSchema),z.lazy(() => PromoCodeUncheckedUpdateWithoutOrderInputSchema) ]),
}).strict();

export const PromoCodeUpdateWithoutOrderInputSchema: z.ZodType<Prisma.PromoCodeUpdateWithoutOrderInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  discountPercent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  maxDiscountCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  validFrom: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  validUntil: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  cart: z.lazy(() => CartUpdateManyWithoutPromoCodeNestedInputSchema).optional()
}).strict();

export const PromoCodeUncheckedUpdateWithoutOrderInputSchema: z.ZodType<Prisma.PromoCodeUncheckedUpdateWithoutOrderInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  discountPercent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  maxDiscountCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  validFrom: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  validUntil: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  cart: z.lazy(() => CartUncheckedUpdateManyWithoutPromoCodeNestedInputSchema).optional()
}).strict();

export const AddressUpsertWithoutOrderInputSchema: z.ZodType<Prisma.AddressUpsertWithoutOrderInput> = z.object({
  update: z.union([ z.lazy(() => AddressUpdateWithoutOrderInputSchema),z.lazy(() => AddressUncheckedUpdateWithoutOrderInputSchema) ]),
  create: z.union([ z.lazy(() => AddressCreateWithoutOrderInputSchema),z.lazy(() => AddressUncheckedCreateWithoutOrderInputSchema) ]),
  where: z.lazy(() => AddressWhereInputSchema).optional()
}).strict();

export const AddressUpdateToOneWithWhereWithoutOrderInputSchema: z.ZodType<Prisma.AddressUpdateToOneWithWhereWithoutOrderInput> = z.object({
  where: z.lazy(() => AddressWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => AddressUpdateWithoutOrderInputSchema),z.lazy(() => AddressUncheckedUpdateWithoutOrderInputSchema) ]),
}).strict();

export const AddressUpdateWithoutOrderInputSchema: z.ZodType<Prisma.AddressUpdateWithoutOrderInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  apartment: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  floor: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  building: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  postalCode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutAddressesNestedInputSchema).optional()
}).strict();

export const AddressUncheckedUpdateWithoutOrderInputSchema: z.ZodType<Prisma.AddressUncheckedUpdateWithoutOrderInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  apartment: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  floor: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  building: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  postalCode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const OrderCreateWithoutOrderItemsInputSchema: z.ZodType<Prisma.OrderCreateWithoutOrderItemsInput> = z.object({
  id: z.string().uuid().optional(),
  totalCents: z.number().int(),
  currency: z.string().optional(),
  paymentMethod: z.lazy(() => PaymentMethodSchema),
  deliveryNeeded: z.boolean(),
  status: z.lazy(() => OrderStatusSchema),
  PaymobOrderId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deliveredAt: z.coerce.date().optional().nullable(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutOrdersInputSchema),
  transporter: z.lazy(() => UserCreateNestedOneWithoutOrderTranportsInputSchema).optional(),
  promoCode: z.lazy(() => PromoCodeCreateNestedOneWithoutOrderInputSchema).optional(),
  deliveryAddress: z.lazy(() => AddressCreateNestedOneWithoutOrderInputSchema)
}).strict();

export const OrderUncheckedCreateWithoutOrderItemsInputSchema: z.ZodType<Prisma.OrderUncheckedCreateWithoutOrderItemsInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  transporterId: z.string().optional().nullable(),
  promoCodeId: z.string().optional().nullable(),
  totalCents: z.number().int(),
  currency: z.string().optional(),
  paymentMethod: z.lazy(() => PaymentMethodSchema),
  deliveryNeeded: z.boolean(),
  status: z.lazy(() => OrderStatusSchema),
  PaymobOrderId: z.string().optional().nullable(),
  deliveryAddressId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deliveredAt: z.coerce.date().optional().nullable(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const OrderCreateOrConnectWithoutOrderItemsInputSchema: z.ZodType<Prisma.OrderCreateOrConnectWithoutOrderItemsInput> = z.object({
  where: z.lazy(() => OrderWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrderCreateWithoutOrderItemsInputSchema),z.lazy(() => OrderUncheckedCreateWithoutOrderItemsInputSchema) ]),
}).strict();

export const ProductCreateWithoutOrderItemInputSchema: z.ZodType<Prisma.ProductCreateWithoutOrderItemInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  sku: z.string(),
  description: z.string(),
  stock: z.number().int().optional(),
  views: z.number().int().optional(),
  priceCents: z.number().int().optional(),
  salePercent: z.number().int().optional(),
  warrantyDays: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  reviews: z.lazy(() => ReviewCreateNestedManyWithoutProductInputSchema).optional(),
  category: z.lazy(() => CategoryCreateNestedOneWithoutProductsInputSchema),
  wishers: z.lazy(() => UserCreateNestedManyWithoutWishlistInputSchema).optional(),
  CartItem: z.lazy(() => CartItemCreateNestedManyWithoutProductInputSchema).optional()
}).strict();

export const ProductUncheckedCreateWithoutOrderItemInputSchema: z.ZodType<Prisma.ProductUncheckedCreateWithoutOrderItemInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  sku: z.string(),
  description: z.string(),
  stock: z.number().int().optional(),
  views: z.number().int().optional(),
  priceCents: z.number().int().optional(),
  salePercent: z.number().int().optional(),
  warrantyDays: z.number().int().optional(),
  categoryId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  reviews: z.lazy(() => ReviewUncheckedCreateNestedManyWithoutProductInputSchema).optional(),
  wishers: z.lazy(() => UserUncheckedCreateNestedManyWithoutWishlistInputSchema).optional(),
  CartItem: z.lazy(() => CartItemUncheckedCreateNestedManyWithoutProductInputSchema).optional()
}).strict();

export const ProductCreateOrConnectWithoutOrderItemInputSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutOrderItemInput> = z.object({
  where: z.lazy(() => ProductWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProductCreateWithoutOrderItemInputSchema),z.lazy(() => ProductUncheckedCreateWithoutOrderItemInputSchema) ]),
}).strict();

export const OrderUpsertWithoutOrderItemsInputSchema: z.ZodType<Prisma.OrderUpsertWithoutOrderItemsInput> = z.object({
  update: z.union([ z.lazy(() => OrderUpdateWithoutOrderItemsInputSchema),z.lazy(() => OrderUncheckedUpdateWithoutOrderItemsInputSchema) ]),
  create: z.union([ z.lazy(() => OrderCreateWithoutOrderItemsInputSchema),z.lazy(() => OrderUncheckedCreateWithoutOrderItemsInputSchema) ]),
  where: z.lazy(() => OrderWhereInputSchema).optional()
}).strict();

export const OrderUpdateToOneWithWhereWithoutOrderItemsInputSchema: z.ZodType<Prisma.OrderUpdateToOneWithWhereWithoutOrderItemsInput> = z.object({
  where: z.lazy(() => OrderWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => OrderUpdateWithoutOrderItemsInputSchema),z.lazy(() => OrderUncheckedUpdateWithoutOrderItemsInputSchema) ]),
}).strict();

export const OrderUpdateWithoutOrderItemsInputSchema: z.ZodType<Prisma.OrderUpdateWithoutOrderItemsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  totalCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  paymentMethod: z.union([ z.lazy(() => PaymentMethodSchema),z.lazy(() => EnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional(),
  deliveryNeeded: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => OrderStatusSchema),z.lazy(() => EnumOrderStatusFieldUpdateOperationsInputSchema) ]).optional(),
  PaymobOrderId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deliveredAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutOrdersNestedInputSchema).optional(),
  transporter: z.lazy(() => UserUpdateOneWithoutOrderTranportsNestedInputSchema).optional(),
  promoCode: z.lazy(() => PromoCodeUpdateOneWithoutOrderNestedInputSchema).optional(),
  deliveryAddress: z.lazy(() => AddressUpdateOneRequiredWithoutOrderNestedInputSchema).optional()
}).strict();

export const OrderUncheckedUpdateWithoutOrderItemsInputSchema: z.ZodType<Prisma.OrderUncheckedUpdateWithoutOrderItemsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transporterId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  promoCodeId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  totalCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  paymentMethod: z.union([ z.lazy(() => PaymentMethodSchema),z.lazy(() => EnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional(),
  deliveryNeeded: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => OrderStatusSchema),z.lazy(() => EnumOrderStatusFieldUpdateOperationsInputSchema) ]).optional(),
  PaymobOrderId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deliveryAddressId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deliveredAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ProductUpsertWithoutOrderItemInputSchema: z.ZodType<Prisma.ProductUpsertWithoutOrderItemInput> = z.object({
  update: z.union([ z.lazy(() => ProductUpdateWithoutOrderItemInputSchema),z.lazy(() => ProductUncheckedUpdateWithoutOrderItemInputSchema) ]),
  create: z.union([ z.lazy(() => ProductCreateWithoutOrderItemInputSchema),z.lazy(() => ProductUncheckedCreateWithoutOrderItemInputSchema) ]),
  where: z.lazy(() => ProductWhereInputSchema).optional()
}).strict();

export const ProductUpdateToOneWithWhereWithoutOrderItemInputSchema: z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutOrderItemInput> = z.object({
  where: z.lazy(() => ProductWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ProductUpdateWithoutOrderItemInputSchema),z.lazy(() => ProductUncheckedUpdateWithoutOrderItemInputSchema) ]),
}).strict();

export const ProductUpdateWithoutOrderItemInputSchema: z.ZodType<Prisma.ProductUpdateWithoutOrderItemInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sku: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stock: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  views: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  priceCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  salePercent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  warrantyDays: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  reviews: z.lazy(() => ReviewUpdateManyWithoutProductNestedInputSchema).optional(),
  category: z.lazy(() => CategoryUpdateOneRequiredWithoutProductsNestedInputSchema).optional(),
  wishers: z.lazy(() => UserUpdateManyWithoutWishlistNestedInputSchema).optional(),
  CartItem: z.lazy(() => CartItemUpdateManyWithoutProductNestedInputSchema).optional()
}).strict();

export const ProductUncheckedUpdateWithoutOrderItemInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateWithoutOrderItemInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sku: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stock: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  views: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  priceCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  salePercent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  warrantyDays: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  categoryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  reviews: z.lazy(() => ReviewUncheckedUpdateManyWithoutProductNestedInputSchema).optional(),
  wishers: z.lazy(() => UserUncheckedUpdateManyWithoutWishlistNestedInputSchema).optional(),
  CartItem: z.lazy(() => CartItemUncheckedUpdateManyWithoutProductNestedInputSchema).optional()
}).strict();

export const ReviewCreateWithoutProductInputSchema: z.ZodType<Prisma.ReviewCreateWithoutProductInput> = z.object({
  id: z.string().uuid().optional(),
  rating: z.number().int(),
  comment: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutReviewInputSchema)
}).strict();

export const ReviewUncheckedCreateWithoutProductInputSchema: z.ZodType<Prisma.ReviewUncheckedCreateWithoutProductInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  rating: z.number().int(),
  comment: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const ReviewCreateOrConnectWithoutProductInputSchema: z.ZodType<Prisma.ReviewCreateOrConnectWithoutProductInput> = z.object({
  where: z.lazy(() => ReviewWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ReviewCreateWithoutProductInputSchema),z.lazy(() => ReviewUncheckedCreateWithoutProductInputSchema) ]),
}).strict();

export const ReviewCreateManyProductInputEnvelopeSchema: z.ZodType<Prisma.ReviewCreateManyProductInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ReviewCreateManyProductInputSchema),z.lazy(() => ReviewCreateManyProductInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const CategoryCreateWithoutProductsInputSchema: z.ZodType<Prisma.CategoryCreateWithoutProductsInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  search: z.lazy(() => searchCreateNestedManyWithoutCategoryInputSchema).optional()
}).strict();

export const CategoryUncheckedCreateWithoutProductsInputSchema: z.ZodType<Prisma.CategoryUncheckedCreateWithoutProductsInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  search: z.lazy(() => searchUncheckedCreateNestedManyWithoutCategoryInputSchema).optional()
}).strict();

export const CategoryCreateOrConnectWithoutProductsInputSchema: z.ZodType<Prisma.CategoryCreateOrConnectWithoutProductsInput> = z.object({
  where: z.lazy(() => CategoryWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CategoryCreateWithoutProductsInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutProductsInputSchema) ]),
}).strict();

export const UserCreateWithoutWishlistInputSchema: z.ZodType<Prisma.UserCreateWithoutWishlistInput> = z.object({
  id: z.string().uuid().optional(),
  email: z.string(),
  emailVerified: z.boolean().optional(),
  passwordHash: z.string(),
  name: z.string(),
  gender: z.lazy(() => GenderSchema),
  dob: z.coerce.date(),
  phone: z.string().optional().nullable(),
  phoneVerified: z.boolean().optional(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  cart: z.lazy(() => CartCreateNestedOneWithoutUserInputSchema),
  addresses: z.lazy(() => AddressCreateNestedManyWithoutUserInputSchema).optional(),
  orders: z.lazy(() => OrderCreateNestedManyWithoutUserInputSchema).optional(),
  returns: z.lazy(() => ReturnCreateNestedManyWithoutUserInputSchema).optional(),
  orderTranports: z.lazy(() => OrderCreateNestedManyWithoutTransporterInputSchema).optional(),
  returnTransports: z.lazy(() => ReturnCreateNestedManyWithoutTransporterInputSchema).optional(),
  Review: z.lazy(() => ReviewCreateNestedManyWithoutUserInputSchema).optional(),
  search: z.lazy(() => searchCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutWishlistInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutWishlistInput> = z.object({
  id: z.string().uuid().optional(),
  email: z.string(),
  emailVerified: z.boolean().optional(),
  passwordHash: z.string(),
  name: z.string(),
  gender: z.lazy(() => GenderSchema),
  dob: z.coerce.date(),
  phone: z.string().optional().nullable(),
  phoneVerified: z.boolean().optional(),
  role: z.lazy(() => RoleSchema).optional(),
  cartId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  addresses: z.lazy(() => AddressUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  orders: z.lazy(() => OrderUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  returns: z.lazy(() => ReturnUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  orderTranports: z.lazy(() => OrderUncheckedCreateNestedManyWithoutTransporterInputSchema).optional(),
  returnTransports: z.lazy(() => ReturnUncheckedCreateNestedManyWithoutTransporterInputSchema).optional(),
  Review: z.lazy(() => ReviewUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  search: z.lazy(() => searchUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutWishlistInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutWishlistInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutWishlistInputSchema),z.lazy(() => UserUncheckedCreateWithoutWishlistInputSchema) ]),
}).strict();

export const CartItemCreateWithoutProductInputSchema: z.ZodType<Prisma.CartItemCreateWithoutProductInput> = z.object({
  id: z.string().uuid().optional(),
  quantity: z.number().int(),
  cart: z.lazy(() => CartCreateNestedOneWithoutCartItemsInputSchema)
}).strict();

export const CartItemUncheckedCreateWithoutProductInputSchema: z.ZodType<Prisma.CartItemUncheckedCreateWithoutProductInput> = z.object({
  id: z.string().uuid().optional(),
  quantity: z.number().int(),
  cartId: z.string()
}).strict();

export const CartItemCreateOrConnectWithoutProductInputSchema: z.ZodType<Prisma.CartItemCreateOrConnectWithoutProductInput> = z.object({
  where: z.lazy(() => CartItemWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CartItemCreateWithoutProductInputSchema),z.lazy(() => CartItemUncheckedCreateWithoutProductInputSchema) ]),
}).strict();

export const CartItemCreateManyProductInputEnvelopeSchema: z.ZodType<Prisma.CartItemCreateManyProductInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => CartItemCreateManyProductInputSchema),z.lazy(() => CartItemCreateManyProductInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const OrderItemCreateWithoutProductInputSchema: z.ZodType<Prisma.OrderItemCreateWithoutProductInput> = z.object({
  productPriceCents: z.number().int(),
  productSalePercent: z.number().int(),
  quantity: z.number().int(),
  warrantyDays: z.number().int(),
  order: z.lazy(() => OrderCreateNestedOneWithoutOrderItemsInputSchema)
}).strict();

export const OrderItemUncheckedCreateWithoutProductInputSchema: z.ZodType<Prisma.OrderItemUncheckedCreateWithoutProductInput> = z.object({
  orderId: z.string(),
  productPriceCents: z.number().int(),
  productSalePercent: z.number().int(),
  quantity: z.number().int(),
  warrantyDays: z.number().int()
}).strict();

export const OrderItemCreateOrConnectWithoutProductInputSchema: z.ZodType<Prisma.OrderItemCreateOrConnectWithoutProductInput> = z.object({
  where: z.lazy(() => OrderItemWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrderItemCreateWithoutProductInputSchema),z.lazy(() => OrderItemUncheckedCreateWithoutProductInputSchema) ]),
}).strict();

export const OrderItemCreateManyProductInputEnvelopeSchema: z.ZodType<Prisma.OrderItemCreateManyProductInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => OrderItemCreateManyProductInputSchema),z.lazy(() => OrderItemCreateManyProductInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ReviewUpsertWithWhereUniqueWithoutProductInputSchema: z.ZodType<Prisma.ReviewUpsertWithWhereUniqueWithoutProductInput> = z.object({
  where: z.lazy(() => ReviewWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ReviewUpdateWithoutProductInputSchema),z.lazy(() => ReviewUncheckedUpdateWithoutProductInputSchema) ]),
  create: z.union([ z.lazy(() => ReviewCreateWithoutProductInputSchema),z.lazy(() => ReviewUncheckedCreateWithoutProductInputSchema) ]),
}).strict();

export const ReviewUpdateWithWhereUniqueWithoutProductInputSchema: z.ZodType<Prisma.ReviewUpdateWithWhereUniqueWithoutProductInput> = z.object({
  where: z.lazy(() => ReviewWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ReviewUpdateWithoutProductInputSchema),z.lazy(() => ReviewUncheckedUpdateWithoutProductInputSchema) ]),
}).strict();

export const ReviewUpdateManyWithWhereWithoutProductInputSchema: z.ZodType<Prisma.ReviewUpdateManyWithWhereWithoutProductInput> = z.object({
  where: z.lazy(() => ReviewScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ReviewUpdateManyMutationInputSchema),z.lazy(() => ReviewUncheckedUpdateManyWithoutProductInputSchema) ]),
}).strict();

export const ReviewScalarWhereInputSchema: z.ZodType<Prisma.ReviewScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ReviewScalarWhereInputSchema),z.lazy(() => ReviewScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ReviewScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ReviewScalarWhereInputSchema),z.lazy(() => ReviewScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  productId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  rating: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  comment: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  deleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const CategoryUpsertWithoutProductsInputSchema: z.ZodType<Prisma.CategoryUpsertWithoutProductsInput> = z.object({
  update: z.union([ z.lazy(() => CategoryUpdateWithoutProductsInputSchema),z.lazy(() => CategoryUncheckedUpdateWithoutProductsInputSchema) ]),
  create: z.union([ z.lazy(() => CategoryCreateWithoutProductsInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutProductsInputSchema) ]),
  where: z.lazy(() => CategoryWhereInputSchema).optional()
}).strict();

export const CategoryUpdateToOneWithWhereWithoutProductsInputSchema: z.ZodType<Prisma.CategoryUpdateToOneWithWhereWithoutProductsInput> = z.object({
  where: z.lazy(() => CategoryWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CategoryUpdateWithoutProductsInputSchema),z.lazy(() => CategoryUncheckedUpdateWithoutProductsInputSchema) ]),
}).strict();

export const CategoryUpdateWithoutProductsInputSchema: z.ZodType<Prisma.CategoryUpdateWithoutProductsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  search: z.lazy(() => searchUpdateManyWithoutCategoryNestedInputSchema).optional()
}).strict();

export const CategoryUncheckedUpdateWithoutProductsInputSchema: z.ZodType<Prisma.CategoryUncheckedUpdateWithoutProductsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  search: z.lazy(() => searchUncheckedUpdateManyWithoutCategoryNestedInputSchema).optional()
}).strict();

export const UserUpsertWithWhereUniqueWithoutWishlistInputSchema: z.ZodType<Prisma.UserUpsertWithWhereUniqueWithoutWishlistInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => UserUpdateWithoutWishlistInputSchema),z.lazy(() => UserUncheckedUpdateWithoutWishlistInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutWishlistInputSchema),z.lazy(() => UserUncheckedCreateWithoutWishlistInputSchema) ]),
}).strict();

export const UserUpdateWithWhereUniqueWithoutWishlistInputSchema: z.ZodType<Prisma.UserUpdateWithWhereUniqueWithoutWishlistInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => UserUpdateWithoutWishlistInputSchema),z.lazy(() => UserUncheckedUpdateWithoutWishlistInputSchema) ]),
}).strict();

export const UserUpdateManyWithWhereWithoutWishlistInputSchema: z.ZodType<Prisma.UserUpdateManyWithWhereWithoutWishlistInput> = z.object({
  where: z.lazy(() => UserScalarWhereInputSchema),
  data: z.union([ z.lazy(() => UserUpdateManyMutationInputSchema),z.lazy(() => UserUncheckedUpdateManyWithoutWishlistInputSchema) ]),
}).strict();

export const UserScalarWhereInputSchema: z.ZodType<Prisma.UserScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereInputSchema),z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereInputSchema),z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  emailVerified: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  passwordHash: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  gender: z.union([ z.lazy(() => EnumGenderFilterSchema),z.lazy(() => GenderSchema) ]).optional(),
  dob: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  phone: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  phoneVerified: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  role: z.union([ z.lazy(() => EnumRoleFilterSchema),z.lazy(() => RoleSchema) ]).optional(),
  cartId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  deleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const CartItemUpsertWithWhereUniqueWithoutProductInputSchema: z.ZodType<Prisma.CartItemUpsertWithWhereUniqueWithoutProductInput> = z.object({
  where: z.lazy(() => CartItemWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CartItemUpdateWithoutProductInputSchema),z.lazy(() => CartItemUncheckedUpdateWithoutProductInputSchema) ]),
  create: z.union([ z.lazy(() => CartItemCreateWithoutProductInputSchema),z.lazy(() => CartItemUncheckedCreateWithoutProductInputSchema) ]),
}).strict();

export const CartItemUpdateWithWhereUniqueWithoutProductInputSchema: z.ZodType<Prisma.CartItemUpdateWithWhereUniqueWithoutProductInput> = z.object({
  where: z.lazy(() => CartItemWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CartItemUpdateWithoutProductInputSchema),z.lazy(() => CartItemUncheckedUpdateWithoutProductInputSchema) ]),
}).strict();

export const CartItemUpdateManyWithWhereWithoutProductInputSchema: z.ZodType<Prisma.CartItemUpdateManyWithWhereWithoutProductInput> = z.object({
  where: z.lazy(() => CartItemScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CartItemUpdateManyMutationInputSchema),z.lazy(() => CartItemUncheckedUpdateManyWithoutProductInputSchema) ]),
}).strict();

export const OrderItemUpsertWithWhereUniqueWithoutProductInputSchema: z.ZodType<Prisma.OrderItemUpsertWithWhereUniqueWithoutProductInput> = z.object({
  where: z.lazy(() => OrderItemWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => OrderItemUpdateWithoutProductInputSchema),z.lazy(() => OrderItemUncheckedUpdateWithoutProductInputSchema) ]),
  create: z.union([ z.lazy(() => OrderItemCreateWithoutProductInputSchema),z.lazy(() => OrderItemUncheckedCreateWithoutProductInputSchema) ]),
}).strict();

export const OrderItemUpdateWithWhereUniqueWithoutProductInputSchema: z.ZodType<Prisma.OrderItemUpdateWithWhereUniqueWithoutProductInput> = z.object({
  where: z.lazy(() => OrderItemWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => OrderItemUpdateWithoutProductInputSchema),z.lazy(() => OrderItemUncheckedUpdateWithoutProductInputSchema) ]),
}).strict();

export const OrderItemUpdateManyWithWhereWithoutProductInputSchema: z.ZodType<Prisma.OrderItemUpdateManyWithWhereWithoutProductInput> = z.object({
  where: z.lazy(() => OrderItemScalarWhereInputSchema),
  data: z.union([ z.lazy(() => OrderItemUpdateManyMutationInputSchema),z.lazy(() => OrderItemUncheckedUpdateManyWithoutProductInputSchema) ]),
}).strict();

export const CartCreateWithoutPromoCodeInputSchema: z.ZodType<Prisma.CartCreateWithoutPromoCodeInput> = z.object({
  id: z.string().uuid().optional(),
  cartItems: z.lazy(() => CartItemCreateNestedManyWithoutCartInputSchema).optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutCartInputSchema).optional()
}).strict();

export const CartUncheckedCreateWithoutPromoCodeInputSchema: z.ZodType<Prisma.CartUncheckedCreateWithoutPromoCodeInput> = z.object({
  id: z.string().uuid().optional(),
  cartItems: z.lazy(() => CartItemUncheckedCreateNestedManyWithoutCartInputSchema).optional(),
  user: z.lazy(() => UserUncheckedCreateNestedOneWithoutCartInputSchema).optional()
}).strict();

export const CartCreateOrConnectWithoutPromoCodeInputSchema: z.ZodType<Prisma.CartCreateOrConnectWithoutPromoCodeInput> = z.object({
  where: z.lazy(() => CartWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CartCreateWithoutPromoCodeInputSchema),z.lazy(() => CartUncheckedCreateWithoutPromoCodeInputSchema) ]),
}).strict();

export const CartCreateManyPromoCodeInputEnvelopeSchema: z.ZodType<Prisma.CartCreateManyPromoCodeInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => CartCreateManyPromoCodeInputSchema),z.lazy(() => CartCreateManyPromoCodeInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const OrderCreateWithoutPromoCodeInputSchema: z.ZodType<Prisma.OrderCreateWithoutPromoCodeInput> = z.object({
  id: z.string().uuid().optional(),
  totalCents: z.number().int(),
  currency: z.string().optional(),
  paymentMethod: z.lazy(() => PaymentMethodSchema),
  deliveryNeeded: z.boolean(),
  status: z.lazy(() => OrderStatusSchema),
  PaymobOrderId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deliveredAt: z.coerce.date().optional().nullable(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutOrdersInputSchema),
  transporter: z.lazy(() => UserCreateNestedOneWithoutOrderTranportsInputSchema).optional(),
  orderItems: z.lazy(() => OrderItemCreateNestedManyWithoutOrderInputSchema).optional(),
  deliveryAddress: z.lazy(() => AddressCreateNestedOneWithoutOrderInputSchema)
}).strict();

export const OrderUncheckedCreateWithoutPromoCodeInputSchema: z.ZodType<Prisma.OrderUncheckedCreateWithoutPromoCodeInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  transporterId: z.string().optional().nullable(),
  totalCents: z.number().int(),
  currency: z.string().optional(),
  paymentMethod: z.lazy(() => PaymentMethodSchema),
  deliveryNeeded: z.boolean(),
  status: z.lazy(() => OrderStatusSchema),
  PaymobOrderId: z.string().optional().nullable(),
  deliveryAddressId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deliveredAt: z.coerce.date().optional().nullable(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  orderItems: z.lazy(() => OrderItemUncheckedCreateNestedManyWithoutOrderInputSchema).optional()
}).strict();

export const OrderCreateOrConnectWithoutPromoCodeInputSchema: z.ZodType<Prisma.OrderCreateOrConnectWithoutPromoCodeInput> = z.object({
  where: z.lazy(() => OrderWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrderCreateWithoutPromoCodeInputSchema),z.lazy(() => OrderUncheckedCreateWithoutPromoCodeInputSchema) ]),
}).strict();

export const OrderCreateManyPromoCodeInputEnvelopeSchema: z.ZodType<Prisma.OrderCreateManyPromoCodeInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => OrderCreateManyPromoCodeInputSchema),z.lazy(() => OrderCreateManyPromoCodeInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const CartUpsertWithWhereUniqueWithoutPromoCodeInputSchema: z.ZodType<Prisma.CartUpsertWithWhereUniqueWithoutPromoCodeInput> = z.object({
  where: z.lazy(() => CartWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CartUpdateWithoutPromoCodeInputSchema),z.lazy(() => CartUncheckedUpdateWithoutPromoCodeInputSchema) ]),
  create: z.union([ z.lazy(() => CartCreateWithoutPromoCodeInputSchema),z.lazy(() => CartUncheckedCreateWithoutPromoCodeInputSchema) ]),
}).strict();

export const CartUpdateWithWhereUniqueWithoutPromoCodeInputSchema: z.ZodType<Prisma.CartUpdateWithWhereUniqueWithoutPromoCodeInput> = z.object({
  where: z.lazy(() => CartWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CartUpdateWithoutPromoCodeInputSchema),z.lazy(() => CartUncheckedUpdateWithoutPromoCodeInputSchema) ]),
}).strict();

export const CartUpdateManyWithWhereWithoutPromoCodeInputSchema: z.ZodType<Prisma.CartUpdateManyWithWhereWithoutPromoCodeInput> = z.object({
  where: z.lazy(() => CartScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CartUpdateManyMutationInputSchema),z.lazy(() => CartUncheckedUpdateManyWithoutPromoCodeInputSchema) ]),
}).strict();

export const CartScalarWhereInputSchema: z.ZodType<Prisma.CartScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CartScalarWhereInputSchema),z.lazy(() => CartScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CartScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CartScalarWhereInputSchema),z.lazy(() => CartScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  promoCodeId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const OrderUpsertWithWhereUniqueWithoutPromoCodeInputSchema: z.ZodType<Prisma.OrderUpsertWithWhereUniqueWithoutPromoCodeInput> = z.object({
  where: z.lazy(() => OrderWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => OrderUpdateWithoutPromoCodeInputSchema),z.lazy(() => OrderUncheckedUpdateWithoutPromoCodeInputSchema) ]),
  create: z.union([ z.lazy(() => OrderCreateWithoutPromoCodeInputSchema),z.lazy(() => OrderUncheckedCreateWithoutPromoCodeInputSchema) ]),
}).strict();

export const OrderUpdateWithWhereUniqueWithoutPromoCodeInputSchema: z.ZodType<Prisma.OrderUpdateWithWhereUniqueWithoutPromoCodeInput> = z.object({
  where: z.lazy(() => OrderWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => OrderUpdateWithoutPromoCodeInputSchema),z.lazy(() => OrderUncheckedUpdateWithoutPromoCodeInputSchema) ]),
}).strict();

export const OrderUpdateManyWithWhereWithoutPromoCodeInputSchema: z.ZodType<Prisma.OrderUpdateManyWithWhereWithoutPromoCodeInput> = z.object({
  where: z.lazy(() => OrderScalarWhereInputSchema),
  data: z.union([ z.lazy(() => OrderUpdateManyMutationInputSchema),z.lazy(() => OrderUncheckedUpdateManyWithoutPromoCodeInputSchema) ]),
}).strict();

export const UserCreateWithoutReturnsInputSchema: z.ZodType<Prisma.UserCreateWithoutReturnsInput> = z.object({
  id: z.string().uuid().optional(),
  email: z.string(),
  emailVerified: z.boolean().optional(),
  passwordHash: z.string(),
  name: z.string(),
  gender: z.lazy(() => GenderSchema),
  dob: z.coerce.date(),
  phone: z.string().optional().nullable(),
  phoneVerified: z.boolean().optional(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  cart: z.lazy(() => CartCreateNestedOneWithoutUserInputSchema),
  addresses: z.lazy(() => AddressCreateNestedManyWithoutUserInputSchema).optional(),
  wishlist: z.lazy(() => ProductCreateNestedManyWithoutWishersInputSchema).optional(),
  orders: z.lazy(() => OrderCreateNestedManyWithoutUserInputSchema).optional(),
  orderTranports: z.lazy(() => OrderCreateNestedManyWithoutTransporterInputSchema).optional(),
  returnTransports: z.lazy(() => ReturnCreateNestedManyWithoutTransporterInputSchema).optional(),
  Review: z.lazy(() => ReviewCreateNestedManyWithoutUserInputSchema).optional(),
  search: z.lazy(() => searchCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutReturnsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutReturnsInput> = z.object({
  id: z.string().uuid().optional(),
  email: z.string(),
  emailVerified: z.boolean().optional(),
  passwordHash: z.string(),
  name: z.string(),
  gender: z.lazy(() => GenderSchema),
  dob: z.coerce.date(),
  phone: z.string().optional().nullable(),
  phoneVerified: z.boolean().optional(),
  role: z.lazy(() => RoleSchema).optional(),
  cartId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  addresses: z.lazy(() => AddressUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  wishlist: z.lazy(() => ProductUncheckedCreateNestedManyWithoutWishersInputSchema).optional(),
  orders: z.lazy(() => OrderUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  orderTranports: z.lazy(() => OrderUncheckedCreateNestedManyWithoutTransporterInputSchema).optional(),
  returnTransports: z.lazy(() => ReturnUncheckedCreateNestedManyWithoutTransporterInputSchema).optional(),
  Review: z.lazy(() => ReviewUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  search: z.lazy(() => searchUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutReturnsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutReturnsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutReturnsInputSchema),z.lazy(() => UserUncheckedCreateWithoutReturnsInputSchema) ]),
}).strict();

export const UserCreateWithoutReturnTransportsInputSchema: z.ZodType<Prisma.UserCreateWithoutReturnTransportsInput> = z.object({
  id: z.string().uuid().optional(),
  email: z.string(),
  emailVerified: z.boolean().optional(),
  passwordHash: z.string(),
  name: z.string(),
  gender: z.lazy(() => GenderSchema),
  dob: z.coerce.date(),
  phone: z.string().optional().nullable(),
  phoneVerified: z.boolean().optional(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  cart: z.lazy(() => CartCreateNestedOneWithoutUserInputSchema),
  addresses: z.lazy(() => AddressCreateNestedManyWithoutUserInputSchema).optional(),
  wishlist: z.lazy(() => ProductCreateNestedManyWithoutWishersInputSchema).optional(),
  orders: z.lazy(() => OrderCreateNestedManyWithoutUserInputSchema).optional(),
  returns: z.lazy(() => ReturnCreateNestedManyWithoutUserInputSchema).optional(),
  orderTranports: z.lazy(() => OrderCreateNestedManyWithoutTransporterInputSchema).optional(),
  Review: z.lazy(() => ReviewCreateNestedManyWithoutUserInputSchema).optional(),
  search: z.lazy(() => searchCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutReturnTransportsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutReturnTransportsInput> = z.object({
  id: z.string().uuid().optional(),
  email: z.string(),
  emailVerified: z.boolean().optional(),
  passwordHash: z.string(),
  name: z.string(),
  gender: z.lazy(() => GenderSchema),
  dob: z.coerce.date(),
  phone: z.string().optional().nullable(),
  phoneVerified: z.boolean().optional(),
  role: z.lazy(() => RoleSchema).optional(),
  cartId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  addresses: z.lazy(() => AddressUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  wishlist: z.lazy(() => ProductUncheckedCreateNestedManyWithoutWishersInputSchema).optional(),
  orders: z.lazy(() => OrderUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  returns: z.lazy(() => ReturnUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  orderTranports: z.lazy(() => OrderUncheckedCreateNestedManyWithoutTransporterInputSchema).optional(),
  Review: z.lazy(() => ReviewUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  search: z.lazy(() => searchUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutReturnTransportsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutReturnTransportsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutReturnTransportsInputSchema),z.lazy(() => UserUncheckedCreateWithoutReturnTransportsInputSchema) ]),
}).strict();

export const UserUpsertWithoutReturnsInputSchema: z.ZodType<Prisma.UserUpsertWithoutReturnsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutReturnsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutReturnsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutReturnsInputSchema),z.lazy(() => UserUncheckedCreateWithoutReturnsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutReturnsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutReturnsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutReturnsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutReturnsInputSchema) ]),
}).strict();

export const UserUpdateWithoutReturnsInputSchema: z.ZodType<Prisma.UserUpdateWithoutReturnsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  passwordHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => GenderSchema),z.lazy(() => EnumGenderFieldUpdateOperationsInputSchema) ]).optional(),
  dob: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cart: z.lazy(() => CartUpdateOneRequiredWithoutUserNestedInputSchema).optional(),
  addresses: z.lazy(() => AddressUpdateManyWithoutUserNestedInputSchema).optional(),
  wishlist: z.lazy(() => ProductUpdateManyWithoutWishersNestedInputSchema).optional(),
  orders: z.lazy(() => OrderUpdateManyWithoutUserNestedInputSchema).optional(),
  orderTranports: z.lazy(() => OrderUpdateManyWithoutTransporterNestedInputSchema).optional(),
  returnTransports: z.lazy(() => ReturnUpdateManyWithoutTransporterNestedInputSchema).optional(),
  Review: z.lazy(() => ReviewUpdateManyWithoutUserNestedInputSchema).optional(),
  search: z.lazy(() => searchUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutReturnsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutReturnsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  passwordHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => GenderSchema),z.lazy(() => EnumGenderFieldUpdateOperationsInputSchema) ]).optional(),
  dob: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  cartId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  addresses: z.lazy(() => AddressUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  wishlist: z.lazy(() => ProductUncheckedUpdateManyWithoutWishersNestedInputSchema).optional(),
  orders: z.lazy(() => OrderUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  orderTranports: z.lazy(() => OrderUncheckedUpdateManyWithoutTransporterNestedInputSchema).optional(),
  returnTransports: z.lazy(() => ReturnUncheckedUpdateManyWithoutTransporterNestedInputSchema).optional(),
  Review: z.lazy(() => ReviewUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  search: z.lazy(() => searchUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUpsertWithoutReturnTransportsInputSchema: z.ZodType<Prisma.UserUpsertWithoutReturnTransportsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutReturnTransportsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutReturnTransportsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutReturnTransportsInputSchema),z.lazy(() => UserUncheckedCreateWithoutReturnTransportsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutReturnTransportsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutReturnTransportsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutReturnTransportsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutReturnTransportsInputSchema) ]),
}).strict();

export const UserUpdateWithoutReturnTransportsInputSchema: z.ZodType<Prisma.UserUpdateWithoutReturnTransportsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  passwordHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => GenderSchema),z.lazy(() => EnumGenderFieldUpdateOperationsInputSchema) ]).optional(),
  dob: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cart: z.lazy(() => CartUpdateOneRequiredWithoutUserNestedInputSchema).optional(),
  addresses: z.lazy(() => AddressUpdateManyWithoutUserNestedInputSchema).optional(),
  wishlist: z.lazy(() => ProductUpdateManyWithoutWishersNestedInputSchema).optional(),
  orders: z.lazy(() => OrderUpdateManyWithoutUserNestedInputSchema).optional(),
  returns: z.lazy(() => ReturnUpdateManyWithoutUserNestedInputSchema).optional(),
  orderTranports: z.lazy(() => OrderUpdateManyWithoutTransporterNestedInputSchema).optional(),
  Review: z.lazy(() => ReviewUpdateManyWithoutUserNestedInputSchema).optional(),
  search: z.lazy(() => searchUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutReturnTransportsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutReturnTransportsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  passwordHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => GenderSchema),z.lazy(() => EnumGenderFieldUpdateOperationsInputSchema) ]).optional(),
  dob: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  cartId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  addresses: z.lazy(() => AddressUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  wishlist: z.lazy(() => ProductUncheckedUpdateManyWithoutWishersNestedInputSchema).optional(),
  orders: z.lazy(() => OrderUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  returns: z.lazy(() => ReturnUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  orderTranports: z.lazy(() => OrderUncheckedUpdateManyWithoutTransporterNestedInputSchema).optional(),
  Review: z.lazy(() => ReviewUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  search: z.lazy(() => searchUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const ProductCreateWithoutReviewsInputSchema: z.ZodType<Prisma.ProductCreateWithoutReviewsInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  sku: z.string(),
  description: z.string(),
  stock: z.number().int().optional(),
  views: z.number().int().optional(),
  priceCents: z.number().int().optional(),
  salePercent: z.number().int().optional(),
  warrantyDays: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  category: z.lazy(() => CategoryCreateNestedOneWithoutProductsInputSchema),
  wishers: z.lazy(() => UserCreateNestedManyWithoutWishlistInputSchema).optional(),
  CartItem: z.lazy(() => CartItemCreateNestedManyWithoutProductInputSchema).optional(),
  OrderItem: z.lazy(() => OrderItemCreateNestedManyWithoutProductInputSchema).optional()
}).strict();

export const ProductUncheckedCreateWithoutReviewsInputSchema: z.ZodType<Prisma.ProductUncheckedCreateWithoutReviewsInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  sku: z.string(),
  description: z.string(),
  stock: z.number().int().optional(),
  views: z.number().int().optional(),
  priceCents: z.number().int().optional(),
  salePercent: z.number().int().optional(),
  warrantyDays: z.number().int().optional(),
  categoryId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  wishers: z.lazy(() => UserUncheckedCreateNestedManyWithoutWishlistInputSchema).optional(),
  CartItem: z.lazy(() => CartItemUncheckedCreateNestedManyWithoutProductInputSchema).optional(),
  OrderItem: z.lazy(() => OrderItemUncheckedCreateNestedManyWithoutProductInputSchema).optional()
}).strict();

export const ProductCreateOrConnectWithoutReviewsInputSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutReviewsInput> = z.object({
  where: z.lazy(() => ProductWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProductCreateWithoutReviewsInputSchema),z.lazy(() => ProductUncheckedCreateWithoutReviewsInputSchema) ]),
}).strict();

export const UserCreateWithoutReviewInputSchema: z.ZodType<Prisma.UserCreateWithoutReviewInput> = z.object({
  id: z.string().uuid().optional(),
  email: z.string(),
  emailVerified: z.boolean().optional(),
  passwordHash: z.string(),
  name: z.string(),
  gender: z.lazy(() => GenderSchema),
  dob: z.coerce.date(),
  phone: z.string().optional().nullable(),
  phoneVerified: z.boolean().optional(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  cart: z.lazy(() => CartCreateNestedOneWithoutUserInputSchema),
  addresses: z.lazy(() => AddressCreateNestedManyWithoutUserInputSchema).optional(),
  wishlist: z.lazy(() => ProductCreateNestedManyWithoutWishersInputSchema).optional(),
  orders: z.lazy(() => OrderCreateNestedManyWithoutUserInputSchema).optional(),
  returns: z.lazy(() => ReturnCreateNestedManyWithoutUserInputSchema).optional(),
  orderTranports: z.lazy(() => OrderCreateNestedManyWithoutTransporterInputSchema).optional(),
  returnTransports: z.lazy(() => ReturnCreateNestedManyWithoutTransporterInputSchema).optional(),
  search: z.lazy(() => searchCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutReviewInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutReviewInput> = z.object({
  id: z.string().uuid().optional(),
  email: z.string(),
  emailVerified: z.boolean().optional(),
  passwordHash: z.string(),
  name: z.string(),
  gender: z.lazy(() => GenderSchema),
  dob: z.coerce.date(),
  phone: z.string().optional().nullable(),
  phoneVerified: z.boolean().optional(),
  role: z.lazy(() => RoleSchema).optional(),
  cartId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  addresses: z.lazy(() => AddressUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  wishlist: z.lazy(() => ProductUncheckedCreateNestedManyWithoutWishersInputSchema).optional(),
  orders: z.lazy(() => OrderUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  returns: z.lazy(() => ReturnUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  orderTranports: z.lazy(() => OrderUncheckedCreateNestedManyWithoutTransporterInputSchema).optional(),
  returnTransports: z.lazy(() => ReturnUncheckedCreateNestedManyWithoutTransporterInputSchema).optional(),
  search: z.lazy(() => searchUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutReviewInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutReviewInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutReviewInputSchema),z.lazy(() => UserUncheckedCreateWithoutReviewInputSchema) ]),
}).strict();

export const ProductUpsertWithoutReviewsInputSchema: z.ZodType<Prisma.ProductUpsertWithoutReviewsInput> = z.object({
  update: z.union([ z.lazy(() => ProductUpdateWithoutReviewsInputSchema),z.lazy(() => ProductUncheckedUpdateWithoutReviewsInputSchema) ]),
  create: z.union([ z.lazy(() => ProductCreateWithoutReviewsInputSchema),z.lazy(() => ProductUncheckedCreateWithoutReviewsInputSchema) ]),
  where: z.lazy(() => ProductWhereInputSchema).optional()
}).strict();

export const ProductUpdateToOneWithWhereWithoutReviewsInputSchema: z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutReviewsInput> = z.object({
  where: z.lazy(() => ProductWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ProductUpdateWithoutReviewsInputSchema),z.lazy(() => ProductUncheckedUpdateWithoutReviewsInputSchema) ]),
}).strict();

export const ProductUpdateWithoutReviewsInputSchema: z.ZodType<Prisma.ProductUpdateWithoutReviewsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sku: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stock: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  views: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  priceCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  salePercent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  warrantyDays: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.lazy(() => CategoryUpdateOneRequiredWithoutProductsNestedInputSchema).optional(),
  wishers: z.lazy(() => UserUpdateManyWithoutWishlistNestedInputSchema).optional(),
  CartItem: z.lazy(() => CartItemUpdateManyWithoutProductNestedInputSchema).optional(),
  OrderItem: z.lazy(() => OrderItemUpdateManyWithoutProductNestedInputSchema).optional()
}).strict();

export const ProductUncheckedUpdateWithoutReviewsInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateWithoutReviewsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sku: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stock: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  views: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  priceCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  salePercent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  warrantyDays: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  categoryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  wishers: z.lazy(() => UserUncheckedUpdateManyWithoutWishlistNestedInputSchema).optional(),
  CartItem: z.lazy(() => CartItemUncheckedUpdateManyWithoutProductNestedInputSchema).optional(),
  OrderItem: z.lazy(() => OrderItemUncheckedUpdateManyWithoutProductNestedInputSchema).optional()
}).strict();

export const UserUpsertWithoutReviewInputSchema: z.ZodType<Prisma.UserUpsertWithoutReviewInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutReviewInputSchema),z.lazy(() => UserUncheckedUpdateWithoutReviewInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutReviewInputSchema),z.lazy(() => UserUncheckedCreateWithoutReviewInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutReviewInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutReviewInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutReviewInputSchema),z.lazy(() => UserUncheckedUpdateWithoutReviewInputSchema) ]),
}).strict();

export const UserUpdateWithoutReviewInputSchema: z.ZodType<Prisma.UserUpdateWithoutReviewInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  passwordHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => GenderSchema),z.lazy(() => EnumGenderFieldUpdateOperationsInputSchema) ]).optional(),
  dob: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cart: z.lazy(() => CartUpdateOneRequiredWithoutUserNestedInputSchema).optional(),
  addresses: z.lazy(() => AddressUpdateManyWithoutUserNestedInputSchema).optional(),
  wishlist: z.lazy(() => ProductUpdateManyWithoutWishersNestedInputSchema).optional(),
  orders: z.lazy(() => OrderUpdateManyWithoutUserNestedInputSchema).optional(),
  returns: z.lazy(() => ReturnUpdateManyWithoutUserNestedInputSchema).optional(),
  orderTranports: z.lazy(() => OrderUpdateManyWithoutTransporterNestedInputSchema).optional(),
  returnTransports: z.lazy(() => ReturnUpdateManyWithoutTransporterNestedInputSchema).optional(),
  search: z.lazy(() => searchUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutReviewInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutReviewInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  passwordHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => GenderSchema),z.lazy(() => EnumGenderFieldUpdateOperationsInputSchema) ]).optional(),
  dob: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  cartId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  addresses: z.lazy(() => AddressUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  wishlist: z.lazy(() => ProductUncheckedUpdateManyWithoutWishersNestedInputSchema).optional(),
  orders: z.lazy(() => OrderUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  returns: z.lazy(() => ReturnUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  orderTranports: z.lazy(() => OrderUncheckedUpdateManyWithoutTransporterNestedInputSchema).optional(),
  returnTransports: z.lazy(() => ReturnUncheckedUpdateManyWithoutTransporterNestedInputSchema).optional(),
  search: z.lazy(() => searchUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutSearchInputSchema: z.ZodType<Prisma.UserCreateWithoutSearchInput> = z.object({
  id: z.string().uuid().optional(),
  email: z.string(),
  emailVerified: z.boolean().optional(),
  passwordHash: z.string(),
  name: z.string(),
  gender: z.lazy(() => GenderSchema),
  dob: z.coerce.date(),
  phone: z.string().optional().nullable(),
  phoneVerified: z.boolean().optional(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  cart: z.lazy(() => CartCreateNestedOneWithoutUserInputSchema),
  addresses: z.lazy(() => AddressCreateNestedManyWithoutUserInputSchema).optional(),
  wishlist: z.lazy(() => ProductCreateNestedManyWithoutWishersInputSchema).optional(),
  orders: z.lazy(() => OrderCreateNestedManyWithoutUserInputSchema).optional(),
  returns: z.lazy(() => ReturnCreateNestedManyWithoutUserInputSchema).optional(),
  orderTranports: z.lazy(() => OrderCreateNestedManyWithoutTransporterInputSchema).optional(),
  returnTransports: z.lazy(() => ReturnCreateNestedManyWithoutTransporterInputSchema).optional(),
  Review: z.lazy(() => ReviewCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutSearchInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutSearchInput> = z.object({
  id: z.string().uuid().optional(),
  email: z.string(),
  emailVerified: z.boolean().optional(),
  passwordHash: z.string(),
  name: z.string(),
  gender: z.lazy(() => GenderSchema),
  dob: z.coerce.date(),
  phone: z.string().optional().nullable(),
  phoneVerified: z.boolean().optional(),
  role: z.lazy(() => RoleSchema).optional(),
  cartId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  addresses: z.lazy(() => AddressUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  wishlist: z.lazy(() => ProductUncheckedCreateNestedManyWithoutWishersInputSchema).optional(),
  orders: z.lazy(() => OrderUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  returns: z.lazy(() => ReturnUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  orderTranports: z.lazy(() => OrderUncheckedCreateNestedManyWithoutTransporterInputSchema).optional(),
  returnTransports: z.lazy(() => ReturnUncheckedCreateNestedManyWithoutTransporterInputSchema).optional(),
  Review: z.lazy(() => ReviewUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutSearchInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutSearchInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutSearchInputSchema),z.lazy(() => UserUncheckedCreateWithoutSearchInputSchema) ]),
}).strict();

export const CategoryCreateWithoutSearchInputSchema: z.ZodType<Prisma.CategoryCreateWithoutSearchInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  products: z.lazy(() => ProductCreateNestedManyWithoutCategoryInputSchema).optional()
}).strict();

export const CategoryUncheckedCreateWithoutSearchInputSchema: z.ZodType<Prisma.CategoryUncheckedCreateWithoutSearchInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  products: z.lazy(() => ProductUncheckedCreateNestedManyWithoutCategoryInputSchema).optional()
}).strict();

export const CategoryCreateOrConnectWithoutSearchInputSchema: z.ZodType<Prisma.CategoryCreateOrConnectWithoutSearchInput> = z.object({
  where: z.lazy(() => CategoryWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CategoryCreateWithoutSearchInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutSearchInputSchema) ]),
}).strict();

export const UserUpsertWithoutSearchInputSchema: z.ZodType<Prisma.UserUpsertWithoutSearchInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutSearchInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSearchInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutSearchInputSchema),z.lazy(() => UserUncheckedCreateWithoutSearchInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutSearchInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutSearchInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutSearchInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSearchInputSchema) ]),
}).strict();

export const UserUpdateWithoutSearchInputSchema: z.ZodType<Prisma.UserUpdateWithoutSearchInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  passwordHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => GenderSchema),z.lazy(() => EnumGenderFieldUpdateOperationsInputSchema) ]).optional(),
  dob: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cart: z.lazy(() => CartUpdateOneRequiredWithoutUserNestedInputSchema).optional(),
  addresses: z.lazy(() => AddressUpdateManyWithoutUserNestedInputSchema).optional(),
  wishlist: z.lazy(() => ProductUpdateManyWithoutWishersNestedInputSchema).optional(),
  orders: z.lazy(() => OrderUpdateManyWithoutUserNestedInputSchema).optional(),
  returns: z.lazy(() => ReturnUpdateManyWithoutUserNestedInputSchema).optional(),
  orderTranports: z.lazy(() => OrderUpdateManyWithoutTransporterNestedInputSchema).optional(),
  returnTransports: z.lazy(() => ReturnUpdateManyWithoutTransporterNestedInputSchema).optional(),
  Review: z.lazy(() => ReviewUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutSearchInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutSearchInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  passwordHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => GenderSchema),z.lazy(() => EnumGenderFieldUpdateOperationsInputSchema) ]).optional(),
  dob: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  cartId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  addresses: z.lazy(() => AddressUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  wishlist: z.lazy(() => ProductUncheckedUpdateManyWithoutWishersNestedInputSchema).optional(),
  orders: z.lazy(() => OrderUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  returns: z.lazy(() => ReturnUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  orderTranports: z.lazy(() => OrderUncheckedUpdateManyWithoutTransporterNestedInputSchema).optional(),
  returnTransports: z.lazy(() => ReturnUncheckedUpdateManyWithoutTransporterNestedInputSchema).optional(),
  Review: z.lazy(() => ReviewUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const CategoryUpsertWithoutSearchInputSchema: z.ZodType<Prisma.CategoryUpsertWithoutSearchInput> = z.object({
  update: z.union([ z.lazy(() => CategoryUpdateWithoutSearchInputSchema),z.lazy(() => CategoryUncheckedUpdateWithoutSearchInputSchema) ]),
  create: z.union([ z.lazy(() => CategoryCreateWithoutSearchInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutSearchInputSchema) ]),
  where: z.lazy(() => CategoryWhereInputSchema).optional()
}).strict();

export const CategoryUpdateToOneWithWhereWithoutSearchInputSchema: z.ZodType<Prisma.CategoryUpdateToOneWithWhereWithoutSearchInput> = z.object({
  where: z.lazy(() => CategoryWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CategoryUpdateWithoutSearchInputSchema),z.lazy(() => CategoryUncheckedUpdateWithoutSearchInputSchema) ]),
}).strict();

export const CategoryUpdateWithoutSearchInputSchema: z.ZodType<Prisma.CategoryUpdateWithoutSearchInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  products: z.lazy(() => ProductUpdateManyWithoutCategoryNestedInputSchema).optional()
}).strict();

export const CategoryUncheckedUpdateWithoutSearchInputSchema: z.ZodType<Prisma.CategoryUncheckedUpdateWithoutSearchInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  products: z.lazy(() => ProductUncheckedUpdateManyWithoutCategoryNestedInputSchema).optional()
}).strict();

export const CartCreateWithoutUserInputSchema: z.ZodType<Prisma.CartCreateWithoutUserInput> = z.object({
  id: z.string().uuid().optional(),
  cartItems: z.lazy(() => CartItemCreateNestedManyWithoutCartInputSchema).optional(),
  promoCode: z.lazy(() => PromoCodeCreateNestedOneWithoutCartInputSchema).optional()
}).strict();

export const CartUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.CartUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().uuid().optional(),
  promoCodeId: z.string().optional().nullable(),
  cartItems: z.lazy(() => CartItemUncheckedCreateNestedManyWithoutCartInputSchema).optional()
}).strict();

export const CartCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.CartCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => CartWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CartCreateWithoutUserInputSchema),z.lazy(() => CartUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const AddressCreateWithoutUserInputSchema: z.ZodType<Prisma.AddressCreateWithoutUserInput> = z.object({
  id: z.string().uuid().optional(),
  apartment: z.string(),
  floor: z.string(),
  building: z.string(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  postalCode: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  Order: z.lazy(() => OrderCreateNestedManyWithoutDeliveryAddressInputSchema).optional()
}).strict();

export const AddressUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.AddressUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().uuid().optional(),
  apartment: z.string(),
  floor: z.string(),
  building: z.string(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  postalCode: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  Order: z.lazy(() => OrderUncheckedCreateNestedManyWithoutDeliveryAddressInputSchema).optional()
}).strict();

export const AddressCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.AddressCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => AddressWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AddressCreateWithoutUserInputSchema),z.lazy(() => AddressUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const AddressCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.AddressCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => AddressCreateManyUserInputSchema),z.lazy(() => AddressCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ProductCreateWithoutWishersInputSchema: z.ZodType<Prisma.ProductCreateWithoutWishersInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  sku: z.string(),
  description: z.string(),
  stock: z.number().int().optional(),
  views: z.number().int().optional(),
  priceCents: z.number().int().optional(),
  salePercent: z.number().int().optional(),
  warrantyDays: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  reviews: z.lazy(() => ReviewCreateNestedManyWithoutProductInputSchema).optional(),
  category: z.lazy(() => CategoryCreateNestedOneWithoutProductsInputSchema),
  CartItem: z.lazy(() => CartItemCreateNestedManyWithoutProductInputSchema).optional(),
  OrderItem: z.lazy(() => OrderItemCreateNestedManyWithoutProductInputSchema).optional()
}).strict();

export const ProductUncheckedCreateWithoutWishersInputSchema: z.ZodType<Prisma.ProductUncheckedCreateWithoutWishersInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  sku: z.string(),
  description: z.string(),
  stock: z.number().int().optional(),
  views: z.number().int().optional(),
  priceCents: z.number().int().optional(),
  salePercent: z.number().int().optional(),
  warrantyDays: z.number().int().optional(),
  categoryId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  reviews: z.lazy(() => ReviewUncheckedCreateNestedManyWithoutProductInputSchema).optional(),
  CartItem: z.lazy(() => CartItemUncheckedCreateNestedManyWithoutProductInputSchema).optional(),
  OrderItem: z.lazy(() => OrderItemUncheckedCreateNestedManyWithoutProductInputSchema).optional()
}).strict();

export const ProductCreateOrConnectWithoutWishersInputSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutWishersInput> = z.object({
  where: z.lazy(() => ProductWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProductCreateWithoutWishersInputSchema),z.lazy(() => ProductUncheckedCreateWithoutWishersInputSchema) ]),
}).strict();

export const OrderCreateWithoutUserInputSchema: z.ZodType<Prisma.OrderCreateWithoutUserInput> = z.object({
  id: z.string().uuid().optional(),
  totalCents: z.number().int(),
  currency: z.string().optional(),
  paymentMethod: z.lazy(() => PaymentMethodSchema),
  deliveryNeeded: z.boolean(),
  status: z.lazy(() => OrderStatusSchema),
  PaymobOrderId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deliveredAt: z.coerce.date().optional().nullable(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  transporter: z.lazy(() => UserCreateNestedOneWithoutOrderTranportsInputSchema).optional(),
  orderItems: z.lazy(() => OrderItemCreateNestedManyWithoutOrderInputSchema).optional(),
  promoCode: z.lazy(() => PromoCodeCreateNestedOneWithoutOrderInputSchema).optional(),
  deliveryAddress: z.lazy(() => AddressCreateNestedOneWithoutOrderInputSchema)
}).strict();

export const OrderUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.OrderUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().uuid().optional(),
  transporterId: z.string().optional().nullable(),
  promoCodeId: z.string().optional().nullable(),
  totalCents: z.number().int(),
  currency: z.string().optional(),
  paymentMethod: z.lazy(() => PaymentMethodSchema),
  deliveryNeeded: z.boolean(),
  status: z.lazy(() => OrderStatusSchema),
  PaymobOrderId: z.string().optional().nullable(),
  deliveryAddressId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deliveredAt: z.coerce.date().optional().nullable(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  orderItems: z.lazy(() => OrderItemUncheckedCreateNestedManyWithoutOrderInputSchema).optional()
}).strict();

export const OrderCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.OrderCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => OrderWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrderCreateWithoutUserInputSchema),z.lazy(() => OrderUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const OrderCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.OrderCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => OrderCreateManyUserInputSchema),z.lazy(() => OrderCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ReturnCreateWithoutUserInputSchema: z.ZodType<Prisma.ReturnCreateWithoutUserInput> = z.object({
  id: z.string().uuid().optional(),
  reason: z.string(),
  status: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  transporter: z.lazy(() => UserCreateNestedOneWithoutReturnTransportsInputSchema).optional()
}).strict();

export const ReturnUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.ReturnUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().uuid().optional(),
  reason: z.string(),
  status: z.string(),
  transporterId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const ReturnCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.ReturnCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => ReturnWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ReturnCreateWithoutUserInputSchema),z.lazy(() => ReturnUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const ReturnCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.ReturnCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ReturnCreateManyUserInputSchema),z.lazy(() => ReturnCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const OrderCreateWithoutTransporterInputSchema: z.ZodType<Prisma.OrderCreateWithoutTransporterInput> = z.object({
  id: z.string().uuid().optional(),
  totalCents: z.number().int(),
  currency: z.string().optional(),
  paymentMethod: z.lazy(() => PaymentMethodSchema),
  deliveryNeeded: z.boolean(),
  status: z.lazy(() => OrderStatusSchema),
  PaymobOrderId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deliveredAt: z.coerce.date().optional().nullable(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutOrdersInputSchema),
  orderItems: z.lazy(() => OrderItemCreateNestedManyWithoutOrderInputSchema).optional(),
  promoCode: z.lazy(() => PromoCodeCreateNestedOneWithoutOrderInputSchema).optional(),
  deliveryAddress: z.lazy(() => AddressCreateNestedOneWithoutOrderInputSchema)
}).strict();

export const OrderUncheckedCreateWithoutTransporterInputSchema: z.ZodType<Prisma.OrderUncheckedCreateWithoutTransporterInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  promoCodeId: z.string().optional().nullable(),
  totalCents: z.number().int(),
  currency: z.string().optional(),
  paymentMethod: z.lazy(() => PaymentMethodSchema),
  deliveryNeeded: z.boolean(),
  status: z.lazy(() => OrderStatusSchema),
  PaymobOrderId: z.string().optional().nullable(),
  deliveryAddressId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deliveredAt: z.coerce.date().optional().nullable(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  orderItems: z.lazy(() => OrderItemUncheckedCreateNestedManyWithoutOrderInputSchema).optional()
}).strict();

export const OrderCreateOrConnectWithoutTransporterInputSchema: z.ZodType<Prisma.OrderCreateOrConnectWithoutTransporterInput> = z.object({
  where: z.lazy(() => OrderWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrderCreateWithoutTransporterInputSchema),z.lazy(() => OrderUncheckedCreateWithoutTransporterInputSchema) ]),
}).strict();

export const OrderCreateManyTransporterInputEnvelopeSchema: z.ZodType<Prisma.OrderCreateManyTransporterInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => OrderCreateManyTransporterInputSchema),z.lazy(() => OrderCreateManyTransporterInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ReturnCreateWithoutTransporterInputSchema: z.ZodType<Prisma.ReturnCreateWithoutTransporterInput> = z.object({
  id: z.string().uuid().optional(),
  reason: z.string(),
  status: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  User: z.lazy(() => UserCreateNestedOneWithoutReturnsInputSchema)
}).strict();

export const ReturnUncheckedCreateWithoutTransporterInputSchema: z.ZodType<Prisma.ReturnUncheckedCreateWithoutTransporterInput> = z.object({
  id: z.string().uuid().optional(),
  reason: z.string(),
  status: z.string(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const ReturnCreateOrConnectWithoutTransporterInputSchema: z.ZodType<Prisma.ReturnCreateOrConnectWithoutTransporterInput> = z.object({
  where: z.lazy(() => ReturnWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ReturnCreateWithoutTransporterInputSchema),z.lazy(() => ReturnUncheckedCreateWithoutTransporterInputSchema) ]),
}).strict();

export const ReturnCreateManyTransporterInputEnvelopeSchema: z.ZodType<Prisma.ReturnCreateManyTransporterInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ReturnCreateManyTransporterInputSchema),z.lazy(() => ReturnCreateManyTransporterInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ReviewCreateWithoutUserInputSchema: z.ZodType<Prisma.ReviewCreateWithoutUserInput> = z.object({
  id: z.string().uuid().optional(),
  rating: z.number().int(),
  comment: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  product: z.lazy(() => ProductCreateNestedOneWithoutReviewsInputSchema)
}).strict();

export const ReviewUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.ReviewUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().uuid().optional(),
  productId: z.string(),
  rating: z.number().int(),
  comment: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const ReviewCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.ReviewCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => ReviewWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ReviewCreateWithoutUserInputSchema),z.lazy(() => ReviewUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const ReviewCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.ReviewCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ReviewCreateManyUserInputSchema),z.lazy(() => ReviewCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const searchCreateWithoutUserInputSchema: z.ZodType<Prisma.searchCreateWithoutUserInput> = z.object({
  id: z.string().uuid().optional(),
  keyWord: z.string(),
  category: z.lazy(() => CategoryCreateNestedOneWithoutSearchInputSchema)
}).strict();

export const searchUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.searchUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().uuid().optional(),
  keyWord: z.string(),
  categoryId: z.string()
}).strict();

export const searchCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.searchCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => searchWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => searchCreateWithoutUserInputSchema),z.lazy(() => searchUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const searchCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.searchCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => searchCreateManyUserInputSchema),z.lazy(() => searchCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const CartUpsertWithoutUserInputSchema: z.ZodType<Prisma.CartUpsertWithoutUserInput> = z.object({
  update: z.union([ z.lazy(() => CartUpdateWithoutUserInputSchema),z.lazy(() => CartUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => CartCreateWithoutUserInputSchema),z.lazy(() => CartUncheckedCreateWithoutUserInputSchema) ]),
  where: z.lazy(() => CartWhereInputSchema).optional()
}).strict();

export const CartUpdateToOneWithWhereWithoutUserInputSchema: z.ZodType<Prisma.CartUpdateToOneWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => CartWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CartUpdateWithoutUserInputSchema),z.lazy(() => CartUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const CartUpdateWithoutUserInputSchema: z.ZodType<Prisma.CartUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  cartItems: z.lazy(() => CartItemUpdateManyWithoutCartNestedInputSchema).optional(),
  promoCode: z.lazy(() => PromoCodeUpdateOneWithoutCartNestedInputSchema).optional()
}).strict();

export const CartUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.CartUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promoCodeId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cartItems: z.lazy(() => CartItemUncheckedUpdateManyWithoutCartNestedInputSchema).optional()
}).strict();

export const AddressUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.AddressUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => AddressWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => AddressUpdateWithoutUserInputSchema),z.lazy(() => AddressUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => AddressCreateWithoutUserInputSchema),z.lazy(() => AddressUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const AddressUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.AddressUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => AddressWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => AddressUpdateWithoutUserInputSchema),z.lazy(() => AddressUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const AddressUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.AddressUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => AddressScalarWhereInputSchema),
  data: z.union([ z.lazy(() => AddressUpdateManyMutationInputSchema),z.lazy(() => AddressUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const AddressScalarWhereInputSchema: z.ZodType<Prisma.AddressScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AddressScalarWhereInputSchema),z.lazy(() => AddressScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AddressScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AddressScalarWhereInputSchema),z.lazy(() => AddressScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  apartment: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  floor: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  building: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  street: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  city: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  state: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  country: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  postalCode: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const ProductUpsertWithWhereUniqueWithoutWishersInputSchema: z.ZodType<Prisma.ProductUpsertWithWhereUniqueWithoutWishersInput> = z.object({
  where: z.lazy(() => ProductWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ProductUpdateWithoutWishersInputSchema),z.lazy(() => ProductUncheckedUpdateWithoutWishersInputSchema) ]),
  create: z.union([ z.lazy(() => ProductCreateWithoutWishersInputSchema),z.lazy(() => ProductUncheckedCreateWithoutWishersInputSchema) ]),
}).strict();

export const ProductUpdateWithWhereUniqueWithoutWishersInputSchema: z.ZodType<Prisma.ProductUpdateWithWhereUniqueWithoutWishersInput> = z.object({
  where: z.lazy(() => ProductWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ProductUpdateWithoutWishersInputSchema),z.lazy(() => ProductUncheckedUpdateWithoutWishersInputSchema) ]),
}).strict();

export const ProductUpdateManyWithWhereWithoutWishersInputSchema: z.ZodType<Prisma.ProductUpdateManyWithWhereWithoutWishersInput> = z.object({
  where: z.lazy(() => ProductScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ProductUpdateManyMutationInputSchema),z.lazy(() => ProductUncheckedUpdateManyWithoutWishersInputSchema) ]),
}).strict();

export const OrderUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.OrderUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => OrderWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => OrderUpdateWithoutUserInputSchema),z.lazy(() => OrderUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => OrderCreateWithoutUserInputSchema),z.lazy(() => OrderUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const OrderUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.OrderUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => OrderWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => OrderUpdateWithoutUserInputSchema),z.lazy(() => OrderUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const OrderUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.OrderUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => OrderScalarWhereInputSchema),
  data: z.union([ z.lazy(() => OrderUpdateManyMutationInputSchema),z.lazy(() => OrderUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const ReturnUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ReturnUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ReturnWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ReturnUpdateWithoutUserInputSchema),z.lazy(() => ReturnUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => ReturnCreateWithoutUserInputSchema),z.lazy(() => ReturnUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const ReturnUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ReturnUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ReturnWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ReturnUpdateWithoutUserInputSchema),z.lazy(() => ReturnUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const ReturnUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.ReturnUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => ReturnScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ReturnUpdateManyMutationInputSchema),z.lazy(() => ReturnUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const ReturnScalarWhereInputSchema: z.ZodType<Prisma.ReturnScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ReturnScalarWhereInputSchema),z.lazy(() => ReturnScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ReturnScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ReturnScalarWhereInputSchema),z.lazy(() => ReturnScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  reason: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  transporterId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  deleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const OrderUpsertWithWhereUniqueWithoutTransporterInputSchema: z.ZodType<Prisma.OrderUpsertWithWhereUniqueWithoutTransporterInput> = z.object({
  where: z.lazy(() => OrderWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => OrderUpdateWithoutTransporterInputSchema),z.lazy(() => OrderUncheckedUpdateWithoutTransporterInputSchema) ]),
  create: z.union([ z.lazy(() => OrderCreateWithoutTransporterInputSchema),z.lazy(() => OrderUncheckedCreateWithoutTransporterInputSchema) ]),
}).strict();

export const OrderUpdateWithWhereUniqueWithoutTransporterInputSchema: z.ZodType<Prisma.OrderUpdateWithWhereUniqueWithoutTransporterInput> = z.object({
  where: z.lazy(() => OrderWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => OrderUpdateWithoutTransporterInputSchema),z.lazy(() => OrderUncheckedUpdateWithoutTransporterInputSchema) ]),
}).strict();

export const OrderUpdateManyWithWhereWithoutTransporterInputSchema: z.ZodType<Prisma.OrderUpdateManyWithWhereWithoutTransporterInput> = z.object({
  where: z.lazy(() => OrderScalarWhereInputSchema),
  data: z.union([ z.lazy(() => OrderUpdateManyMutationInputSchema),z.lazy(() => OrderUncheckedUpdateManyWithoutTransporterInputSchema) ]),
}).strict();

export const ReturnUpsertWithWhereUniqueWithoutTransporterInputSchema: z.ZodType<Prisma.ReturnUpsertWithWhereUniqueWithoutTransporterInput> = z.object({
  where: z.lazy(() => ReturnWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ReturnUpdateWithoutTransporterInputSchema),z.lazy(() => ReturnUncheckedUpdateWithoutTransporterInputSchema) ]),
  create: z.union([ z.lazy(() => ReturnCreateWithoutTransporterInputSchema),z.lazy(() => ReturnUncheckedCreateWithoutTransporterInputSchema) ]),
}).strict();

export const ReturnUpdateWithWhereUniqueWithoutTransporterInputSchema: z.ZodType<Prisma.ReturnUpdateWithWhereUniqueWithoutTransporterInput> = z.object({
  where: z.lazy(() => ReturnWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ReturnUpdateWithoutTransporterInputSchema),z.lazy(() => ReturnUncheckedUpdateWithoutTransporterInputSchema) ]),
}).strict();

export const ReturnUpdateManyWithWhereWithoutTransporterInputSchema: z.ZodType<Prisma.ReturnUpdateManyWithWhereWithoutTransporterInput> = z.object({
  where: z.lazy(() => ReturnScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ReturnUpdateManyMutationInputSchema),z.lazy(() => ReturnUncheckedUpdateManyWithoutTransporterInputSchema) ]),
}).strict();

export const ReviewUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ReviewUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ReviewWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ReviewUpdateWithoutUserInputSchema),z.lazy(() => ReviewUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => ReviewCreateWithoutUserInputSchema),z.lazy(() => ReviewUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const ReviewUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ReviewUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ReviewWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ReviewUpdateWithoutUserInputSchema),z.lazy(() => ReviewUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const ReviewUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.ReviewUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => ReviewScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ReviewUpdateManyMutationInputSchema),z.lazy(() => ReviewUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const searchUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.searchUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => searchWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => searchUpdateWithoutUserInputSchema),z.lazy(() => searchUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => searchCreateWithoutUserInputSchema),z.lazy(() => searchUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const searchUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.searchUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => searchWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => searchUpdateWithoutUserInputSchema),z.lazy(() => searchUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const searchUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.searchUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => searchScalarWhereInputSchema),
  data: z.union([ z.lazy(() => searchUpdateManyMutationInputSchema),z.lazy(() => searchUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const OrderCreateManyDeliveryAddressInputSchema: z.ZodType<Prisma.OrderCreateManyDeliveryAddressInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  transporterId: z.string().optional().nullable(),
  promoCodeId: z.string().optional().nullable(),
  totalCents: z.number().int(),
  currency: z.string().optional(),
  paymentMethod: z.lazy(() => PaymentMethodSchema),
  deliveryNeeded: z.boolean(),
  status: z.lazy(() => OrderStatusSchema),
  PaymobOrderId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deliveredAt: z.coerce.date().optional().nullable(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const OrderUpdateWithoutDeliveryAddressInputSchema: z.ZodType<Prisma.OrderUpdateWithoutDeliveryAddressInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  totalCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  paymentMethod: z.union([ z.lazy(() => PaymentMethodSchema),z.lazy(() => EnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional(),
  deliveryNeeded: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => OrderStatusSchema),z.lazy(() => EnumOrderStatusFieldUpdateOperationsInputSchema) ]).optional(),
  PaymobOrderId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deliveredAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutOrdersNestedInputSchema).optional(),
  transporter: z.lazy(() => UserUpdateOneWithoutOrderTranportsNestedInputSchema).optional(),
  orderItems: z.lazy(() => OrderItemUpdateManyWithoutOrderNestedInputSchema).optional(),
  promoCode: z.lazy(() => PromoCodeUpdateOneWithoutOrderNestedInputSchema).optional()
}).strict();

export const OrderUncheckedUpdateWithoutDeliveryAddressInputSchema: z.ZodType<Prisma.OrderUncheckedUpdateWithoutDeliveryAddressInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transporterId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  promoCodeId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  totalCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  paymentMethod: z.union([ z.lazy(() => PaymentMethodSchema),z.lazy(() => EnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional(),
  deliveryNeeded: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => OrderStatusSchema),z.lazy(() => EnumOrderStatusFieldUpdateOperationsInputSchema) ]).optional(),
  PaymobOrderId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deliveredAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  orderItems: z.lazy(() => OrderItemUncheckedUpdateManyWithoutOrderNestedInputSchema).optional()
}).strict();

export const OrderUncheckedUpdateManyWithoutDeliveryAddressInputSchema: z.ZodType<Prisma.OrderUncheckedUpdateManyWithoutDeliveryAddressInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transporterId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  promoCodeId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  totalCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  paymentMethod: z.union([ z.lazy(() => PaymentMethodSchema),z.lazy(() => EnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional(),
  deliveryNeeded: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => OrderStatusSchema),z.lazy(() => EnumOrderStatusFieldUpdateOperationsInputSchema) ]).optional(),
  PaymobOrderId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deliveredAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const CartItemCreateManyCartInputSchema: z.ZodType<Prisma.CartItemCreateManyCartInput> = z.object({
  id: z.string().uuid().optional(),
  productId: z.string(),
  quantity: z.number().int()
}).strict();

export const CartItemUpdateWithoutCartInputSchema: z.ZodType<Prisma.CartItemUpdateWithoutCartInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  product: z.lazy(() => ProductUpdateOneRequiredWithoutCartItemNestedInputSchema).optional()
}).strict();

export const CartItemUncheckedUpdateWithoutCartInputSchema: z.ZodType<Prisma.CartItemUncheckedUpdateWithoutCartInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  productId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CartItemUncheckedUpdateManyWithoutCartInputSchema: z.ZodType<Prisma.CartItemUncheckedUpdateManyWithoutCartInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  productId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProductCreateManyCategoryInputSchema: z.ZodType<Prisma.ProductCreateManyCategoryInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  sku: z.string(),
  description: z.string(),
  stock: z.number().int().optional(),
  views: z.number().int().optional(),
  priceCents: z.number().int().optional(),
  salePercent: z.number().int().optional(),
  warrantyDays: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional()
}).strict();

export const searchCreateManyCategoryInputSchema: z.ZodType<Prisma.searchCreateManyCategoryInput> = z.object({
  id: z.string().uuid().optional(),
  keyWord: z.string(),
  userId: z.string().optional().nullable()
}).strict();

export const ProductUpdateWithoutCategoryInputSchema: z.ZodType<Prisma.ProductUpdateWithoutCategoryInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sku: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stock: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  views: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  priceCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  salePercent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  warrantyDays: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  reviews: z.lazy(() => ReviewUpdateManyWithoutProductNestedInputSchema).optional(),
  wishers: z.lazy(() => UserUpdateManyWithoutWishlistNestedInputSchema).optional(),
  CartItem: z.lazy(() => CartItemUpdateManyWithoutProductNestedInputSchema).optional(),
  OrderItem: z.lazy(() => OrderItemUpdateManyWithoutProductNestedInputSchema).optional()
}).strict();

export const ProductUncheckedUpdateWithoutCategoryInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateWithoutCategoryInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sku: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stock: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  views: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  priceCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  salePercent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  warrantyDays: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  reviews: z.lazy(() => ReviewUncheckedUpdateManyWithoutProductNestedInputSchema).optional(),
  wishers: z.lazy(() => UserUncheckedUpdateManyWithoutWishlistNestedInputSchema).optional(),
  CartItem: z.lazy(() => CartItemUncheckedUpdateManyWithoutProductNestedInputSchema).optional(),
  OrderItem: z.lazy(() => OrderItemUncheckedUpdateManyWithoutProductNestedInputSchema).optional()
}).strict();

export const ProductUncheckedUpdateManyWithoutCategoryInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateManyWithoutCategoryInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sku: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stock: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  views: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  priceCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  salePercent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  warrantyDays: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const searchUpdateWithoutCategoryInputSchema: z.ZodType<Prisma.searchUpdateWithoutCategoryInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  keyWord: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneWithoutSearchNestedInputSchema).optional()
}).strict();

export const searchUncheckedUpdateWithoutCategoryInputSchema: z.ZodType<Prisma.searchUncheckedUpdateWithoutCategoryInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  keyWord: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const searchUncheckedUpdateManyWithoutCategoryInputSchema: z.ZodType<Prisma.searchUncheckedUpdateManyWithoutCategoryInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  keyWord: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const OrderItemCreateManyOrderInputSchema: z.ZodType<Prisma.OrderItemCreateManyOrderInput> = z.object({
  productId: z.string(),
  productPriceCents: z.number().int(),
  productSalePercent: z.number().int(),
  quantity: z.number().int(),
  warrantyDays: z.number().int()
}).strict();

export const OrderItemUpdateWithoutOrderInputSchema: z.ZodType<Prisma.OrderItemUpdateWithoutOrderInput> = z.object({
  productPriceCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  productSalePercent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  warrantyDays: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  product: z.lazy(() => ProductUpdateOneRequiredWithoutOrderItemNestedInputSchema).optional()
}).strict();

export const OrderItemUncheckedUpdateWithoutOrderInputSchema: z.ZodType<Prisma.OrderItemUncheckedUpdateWithoutOrderInput> = z.object({
  productId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  productPriceCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  productSalePercent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  warrantyDays: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrderItemUncheckedUpdateManyWithoutOrderInputSchema: z.ZodType<Prisma.OrderItemUncheckedUpdateManyWithoutOrderInput> = z.object({
  productId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  productPriceCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  productSalePercent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  warrantyDays: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ReviewCreateManyProductInputSchema: z.ZodType<Prisma.ReviewCreateManyProductInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  rating: z.number().int(),
  comment: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const CartItemCreateManyProductInputSchema: z.ZodType<Prisma.CartItemCreateManyProductInput> = z.object({
  id: z.string().uuid().optional(),
  quantity: z.number().int(),
  cartId: z.string()
}).strict();

export const OrderItemCreateManyProductInputSchema: z.ZodType<Prisma.OrderItemCreateManyProductInput> = z.object({
  orderId: z.string(),
  productPriceCents: z.number().int(),
  productSalePercent: z.number().int(),
  quantity: z.number().int(),
  warrantyDays: z.number().int()
}).strict();

export const ReviewUpdateWithoutProductInputSchema: z.ZodType<Prisma.ReviewUpdateWithoutProductInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  comment: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutReviewNestedInputSchema).optional()
}).strict();

export const ReviewUncheckedUpdateWithoutProductInputSchema: z.ZodType<Prisma.ReviewUncheckedUpdateWithoutProductInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  comment: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ReviewUncheckedUpdateManyWithoutProductInputSchema: z.ZodType<Prisma.ReviewUncheckedUpdateManyWithoutProductInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  comment: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const UserUpdateWithoutWishlistInputSchema: z.ZodType<Prisma.UserUpdateWithoutWishlistInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  passwordHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => GenderSchema),z.lazy(() => EnumGenderFieldUpdateOperationsInputSchema) ]).optional(),
  dob: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cart: z.lazy(() => CartUpdateOneRequiredWithoutUserNestedInputSchema).optional(),
  addresses: z.lazy(() => AddressUpdateManyWithoutUserNestedInputSchema).optional(),
  orders: z.lazy(() => OrderUpdateManyWithoutUserNestedInputSchema).optional(),
  returns: z.lazy(() => ReturnUpdateManyWithoutUserNestedInputSchema).optional(),
  orderTranports: z.lazy(() => OrderUpdateManyWithoutTransporterNestedInputSchema).optional(),
  returnTransports: z.lazy(() => ReturnUpdateManyWithoutTransporterNestedInputSchema).optional(),
  Review: z.lazy(() => ReviewUpdateManyWithoutUserNestedInputSchema).optional(),
  search: z.lazy(() => searchUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutWishlistInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutWishlistInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  passwordHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => GenderSchema),z.lazy(() => EnumGenderFieldUpdateOperationsInputSchema) ]).optional(),
  dob: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  cartId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  addresses: z.lazy(() => AddressUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  orders: z.lazy(() => OrderUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  returns: z.lazy(() => ReturnUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  orderTranports: z.lazy(() => OrderUncheckedUpdateManyWithoutTransporterNestedInputSchema).optional(),
  returnTransports: z.lazy(() => ReturnUncheckedUpdateManyWithoutTransporterNestedInputSchema).optional(),
  Review: z.lazy(() => ReviewUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  search: z.lazy(() => searchUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateManyWithoutWishlistInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyWithoutWishlistInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  passwordHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => GenderSchema),z.lazy(() => EnumGenderFieldUpdateOperationsInputSchema) ]).optional(),
  dob: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  cartId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const CartItemUpdateWithoutProductInputSchema: z.ZodType<Prisma.CartItemUpdateWithoutProductInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  cart: z.lazy(() => CartUpdateOneRequiredWithoutCartItemsNestedInputSchema).optional()
}).strict();

export const CartItemUncheckedUpdateWithoutProductInputSchema: z.ZodType<Prisma.CartItemUncheckedUpdateWithoutProductInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  cartId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CartItemUncheckedUpdateManyWithoutProductInputSchema: z.ZodType<Prisma.CartItemUncheckedUpdateManyWithoutProductInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  cartId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrderItemUpdateWithoutProductInputSchema: z.ZodType<Prisma.OrderItemUpdateWithoutProductInput> = z.object({
  productPriceCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  productSalePercent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  warrantyDays: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  order: z.lazy(() => OrderUpdateOneRequiredWithoutOrderItemsNestedInputSchema).optional()
}).strict();

export const OrderItemUncheckedUpdateWithoutProductInputSchema: z.ZodType<Prisma.OrderItemUncheckedUpdateWithoutProductInput> = z.object({
  orderId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  productPriceCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  productSalePercent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  warrantyDays: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrderItemUncheckedUpdateManyWithoutProductInputSchema: z.ZodType<Prisma.OrderItemUncheckedUpdateManyWithoutProductInput> = z.object({
  orderId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  productPriceCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  productSalePercent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  warrantyDays: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CartCreateManyPromoCodeInputSchema: z.ZodType<Prisma.CartCreateManyPromoCodeInput> = z.object({
  id: z.string().uuid().optional()
}).strict();

export const OrderCreateManyPromoCodeInputSchema: z.ZodType<Prisma.OrderCreateManyPromoCodeInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  transporterId: z.string().optional().nullable(),
  totalCents: z.number().int(),
  currency: z.string().optional(),
  paymentMethod: z.lazy(() => PaymentMethodSchema),
  deliveryNeeded: z.boolean(),
  status: z.lazy(() => OrderStatusSchema),
  PaymobOrderId: z.string().optional().nullable(),
  deliveryAddressId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deliveredAt: z.coerce.date().optional().nullable(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const CartUpdateWithoutPromoCodeInputSchema: z.ZodType<Prisma.CartUpdateWithoutPromoCodeInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  cartItems: z.lazy(() => CartItemUpdateManyWithoutCartNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneWithoutCartNestedInputSchema).optional()
}).strict();

export const CartUncheckedUpdateWithoutPromoCodeInputSchema: z.ZodType<Prisma.CartUncheckedUpdateWithoutPromoCodeInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  cartItems: z.lazy(() => CartItemUncheckedUpdateManyWithoutCartNestedInputSchema).optional(),
  user: z.lazy(() => UserUncheckedUpdateOneWithoutCartNestedInputSchema).optional()
}).strict();

export const CartUncheckedUpdateManyWithoutPromoCodeInputSchema: z.ZodType<Prisma.CartUncheckedUpdateManyWithoutPromoCodeInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrderUpdateWithoutPromoCodeInputSchema: z.ZodType<Prisma.OrderUpdateWithoutPromoCodeInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  totalCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  paymentMethod: z.union([ z.lazy(() => PaymentMethodSchema),z.lazy(() => EnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional(),
  deliveryNeeded: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => OrderStatusSchema),z.lazy(() => EnumOrderStatusFieldUpdateOperationsInputSchema) ]).optional(),
  PaymobOrderId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deliveredAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutOrdersNestedInputSchema).optional(),
  transporter: z.lazy(() => UserUpdateOneWithoutOrderTranportsNestedInputSchema).optional(),
  orderItems: z.lazy(() => OrderItemUpdateManyWithoutOrderNestedInputSchema).optional(),
  deliveryAddress: z.lazy(() => AddressUpdateOneRequiredWithoutOrderNestedInputSchema).optional()
}).strict();

export const OrderUncheckedUpdateWithoutPromoCodeInputSchema: z.ZodType<Prisma.OrderUncheckedUpdateWithoutPromoCodeInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transporterId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  totalCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  paymentMethod: z.union([ z.lazy(() => PaymentMethodSchema),z.lazy(() => EnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional(),
  deliveryNeeded: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => OrderStatusSchema),z.lazy(() => EnumOrderStatusFieldUpdateOperationsInputSchema) ]).optional(),
  PaymobOrderId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deliveryAddressId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deliveredAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  orderItems: z.lazy(() => OrderItemUncheckedUpdateManyWithoutOrderNestedInputSchema).optional()
}).strict();

export const OrderUncheckedUpdateManyWithoutPromoCodeInputSchema: z.ZodType<Prisma.OrderUncheckedUpdateManyWithoutPromoCodeInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transporterId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  totalCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  paymentMethod: z.union([ z.lazy(() => PaymentMethodSchema),z.lazy(() => EnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional(),
  deliveryNeeded: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => OrderStatusSchema),z.lazy(() => EnumOrderStatusFieldUpdateOperationsInputSchema) ]).optional(),
  PaymobOrderId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deliveryAddressId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deliveredAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AddressCreateManyUserInputSchema: z.ZodType<Prisma.AddressCreateManyUserInput> = z.object({
  id: z.string().uuid().optional(),
  apartment: z.string(),
  floor: z.string(),
  building: z.string(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  postalCode: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const OrderCreateManyUserInputSchema: z.ZodType<Prisma.OrderCreateManyUserInput> = z.object({
  id: z.string().uuid().optional(),
  transporterId: z.string().optional().nullable(),
  promoCodeId: z.string().optional().nullable(),
  totalCents: z.number().int(),
  currency: z.string().optional(),
  paymentMethod: z.lazy(() => PaymentMethodSchema),
  deliveryNeeded: z.boolean(),
  status: z.lazy(() => OrderStatusSchema),
  PaymobOrderId: z.string().optional().nullable(),
  deliveryAddressId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deliveredAt: z.coerce.date().optional().nullable(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const ReturnCreateManyUserInputSchema: z.ZodType<Prisma.ReturnCreateManyUserInput> = z.object({
  id: z.string().uuid().optional(),
  reason: z.string(),
  status: z.string(),
  transporterId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const OrderCreateManyTransporterInputSchema: z.ZodType<Prisma.OrderCreateManyTransporterInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  promoCodeId: z.string().optional().nullable(),
  totalCents: z.number().int(),
  currency: z.string().optional(),
  paymentMethod: z.lazy(() => PaymentMethodSchema),
  deliveryNeeded: z.boolean(),
  status: z.lazy(() => OrderStatusSchema),
  PaymobOrderId: z.string().optional().nullable(),
  deliveryAddressId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deliveredAt: z.coerce.date().optional().nullable(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const ReturnCreateManyTransporterInputSchema: z.ZodType<Prisma.ReturnCreateManyTransporterInput> = z.object({
  id: z.string().uuid().optional(),
  reason: z.string(),
  status: z.string(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const ReviewCreateManyUserInputSchema: z.ZodType<Prisma.ReviewCreateManyUserInput> = z.object({
  id: z.string().uuid().optional(),
  productId: z.string(),
  rating: z.number().int(),
  comment: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deleted: z.boolean().optional(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const searchCreateManyUserInputSchema: z.ZodType<Prisma.searchCreateManyUserInput> = z.object({
  id: z.string().uuid().optional(),
  keyWord: z.string(),
  categoryId: z.string()
}).strict();

export const AddressUpdateWithoutUserInputSchema: z.ZodType<Prisma.AddressUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  apartment: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  floor: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  building: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  postalCode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  Order: z.lazy(() => OrderUpdateManyWithoutDeliveryAddressNestedInputSchema).optional()
}).strict();

export const AddressUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.AddressUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  apartment: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  floor: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  building: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  postalCode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  Order: z.lazy(() => OrderUncheckedUpdateManyWithoutDeliveryAddressNestedInputSchema).optional()
}).strict();

export const AddressUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.AddressUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  apartment: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  floor: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  building: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  postalCode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ProductUpdateWithoutWishersInputSchema: z.ZodType<Prisma.ProductUpdateWithoutWishersInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sku: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stock: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  views: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  priceCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  salePercent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  warrantyDays: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  reviews: z.lazy(() => ReviewUpdateManyWithoutProductNestedInputSchema).optional(),
  category: z.lazy(() => CategoryUpdateOneRequiredWithoutProductsNestedInputSchema).optional(),
  CartItem: z.lazy(() => CartItemUpdateManyWithoutProductNestedInputSchema).optional(),
  OrderItem: z.lazy(() => OrderItemUpdateManyWithoutProductNestedInputSchema).optional()
}).strict();

export const ProductUncheckedUpdateWithoutWishersInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateWithoutWishersInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sku: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stock: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  views: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  priceCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  salePercent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  warrantyDays: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  categoryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  reviews: z.lazy(() => ReviewUncheckedUpdateManyWithoutProductNestedInputSchema).optional(),
  CartItem: z.lazy(() => CartItemUncheckedUpdateManyWithoutProductNestedInputSchema).optional(),
  OrderItem: z.lazy(() => OrderItemUncheckedUpdateManyWithoutProductNestedInputSchema).optional()
}).strict();

export const ProductUncheckedUpdateManyWithoutWishersInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateManyWithoutWishersInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sku: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  stock: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  views: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  priceCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  salePercent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  warrantyDays: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  categoryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrderUpdateWithoutUserInputSchema: z.ZodType<Prisma.OrderUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  totalCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  paymentMethod: z.union([ z.lazy(() => PaymentMethodSchema),z.lazy(() => EnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional(),
  deliveryNeeded: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => OrderStatusSchema),z.lazy(() => EnumOrderStatusFieldUpdateOperationsInputSchema) ]).optional(),
  PaymobOrderId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deliveredAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  transporter: z.lazy(() => UserUpdateOneWithoutOrderTranportsNestedInputSchema).optional(),
  orderItems: z.lazy(() => OrderItemUpdateManyWithoutOrderNestedInputSchema).optional(),
  promoCode: z.lazy(() => PromoCodeUpdateOneWithoutOrderNestedInputSchema).optional(),
  deliveryAddress: z.lazy(() => AddressUpdateOneRequiredWithoutOrderNestedInputSchema).optional()
}).strict();

export const OrderUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.OrderUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transporterId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  promoCodeId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  totalCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  paymentMethod: z.union([ z.lazy(() => PaymentMethodSchema),z.lazy(() => EnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional(),
  deliveryNeeded: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => OrderStatusSchema),z.lazy(() => EnumOrderStatusFieldUpdateOperationsInputSchema) ]).optional(),
  PaymobOrderId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deliveryAddressId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deliveredAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  orderItems: z.lazy(() => OrderItemUncheckedUpdateManyWithoutOrderNestedInputSchema).optional()
}).strict();

export const OrderUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.OrderUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transporterId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  promoCodeId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  totalCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  paymentMethod: z.union([ z.lazy(() => PaymentMethodSchema),z.lazy(() => EnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional(),
  deliveryNeeded: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => OrderStatusSchema),z.lazy(() => EnumOrderStatusFieldUpdateOperationsInputSchema) ]).optional(),
  PaymobOrderId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deliveryAddressId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deliveredAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ReturnUpdateWithoutUserInputSchema: z.ZodType<Prisma.ReturnUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  reason: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  transporter: z.lazy(() => UserUpdateOneWithoutReturnTransportsNestedInputSchema).optional()
}).strict();

export const ReturnUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.ReturnUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  reason: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transporterId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ReturnUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.ReturnUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  reason: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transporterId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const OrderUpdateWithoutTransporterInputSchema: z.ZodType<Prisma.OrderUpdateWithoutTransporterInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  totalCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  paymentMethod: z.union([ z.lazy(() => PaymentMethodSchema),z.lazy(() => EnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional(),
  deliveryNeeded: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => OrderStatusSchema),z.lazy(() => EnumOrderStatusFieldUpdateOperationsInputSchema) ]).optional(),
  PaymobOrderId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deliveredAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutOrdersNestedInputSchema).optional(),
  orderItems: z.lazy(() => OrderItemUpdateManyWithoutOrderNestedInputSchema).optional(),
  promoCode: z.lazy(() => PromoCodeUpdateOneWithoutOrderNestedInputSchema).optional(),
  deliveryAddress: z.lazy(() => AddressUpdateOneRequiredWithoutOrderNestedInputSchema).optional()
}).strict();

export const OrderUncheckedUpdateWithoutTransporterInputSchema: z.ZodType<Prisma.OrderUncheckedUpdateWithoutTransporterInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promoCodeId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  totalCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  paymentMethod: z.union([ z.lazy(() => PaymentMethodSchema),z.lazy(() => EnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional(),
  deliveryNeeded: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => OrderStatusSchema),z.lazy(() => EnumOrderStatusFieldUpdateOperationsInputSchema) ]).optional(),
  PaymobOrderId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deliveryAddressId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deliveredAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  orderItems: z.lazy(() => OrderItemUncheckedUpdateManyWithoutOrderNestedInputSchema).optional()
}).strict();

export const OrderUncheckedUpdateManyWithoutTransporterInputSchema: z.ZodType<Prisma.OrderUncheckedUpdateManyWithoutTransporterInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  promoCodeId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  totalCents: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  paymentMethod: z.union([ z.lazy(() => PaymentMethodSchema),z.lazy(() => EnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional(),
  deliveryNeeded: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => OrderStatusSchema),z.lazy(() => EnumOrderStatusFieldUpdateOperationsInputSchema) ]).optional(),
  PaymobOrderId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deliveryAddressId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deliveredAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ReturnUpdateWithoutTransporterInputSchema: z.ZodType<Prisma.ReturnUpdateWithoutTransporterInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  reason: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  User: z.lazy(() => UserUpdateOneRequiredWithoutReturnsNestedInputSchema).optional()
}).strict();

export const ReturnUncheckedUpdateWithoutTransporterInputSchema: z.ZodType<Prisma.ReturnUncheckedUpdateWithoutTransporterInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  reason: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ReturnUncheckedUpdateManyWithoutTransporterInputSchema: z.ZodType<Prisma.ReturnUncheckedUpdateManyWithoutTransporterInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  reason: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ReviewUpdateWithoutUserInputSchema: z.ZodType<Prisma.ReviewUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  comment: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  product: z.lazy(() => ProductUpdateOneRequiredWithoutReviewsNestedInputSchema).optional()
}).strict();

export const ReviewUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.ReviewUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  productId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  comment: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ReviewUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.ReviewUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  productId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  comment: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const searchUpdateWithoutUserInputSchema: z.ZodType<Prisma.searchUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  keyWord: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.lazy(() => CategoryUpdateOneRequiredWithoutSearchNestedInputSchema).optional()
}).strict();

export const searchUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.searchUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  keyWord: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  categoryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const searchUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.searchUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  keyWord: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  categoryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const AddressFindFirstArgsSchema: z.ZodType<Prisma.AddressFindFirstArgs> = z.object({
  select: AddressSelectSchema.optional(),
  include: AddressIncludeSchema.optional(),
  where: AddressWhereInputSchema.optional(),
  orderBy: z.union([ AddressOrderByWithRelationInputSchema.array(),AddressOrderByWithRelationInputSchema ]).optional(),
  cursor: AddressWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AddressScalarFieldEnumSchema,AddressScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AddressFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AddressFindFirstOrThrowArgs> = z.object({
  select: AddressSelectSchema.optional(),
  include: AddressIncludeSchema.optional(),
  where: AddressWhereInputSchema.optional(),
  orderBy: z.union([ AddressOrderByWithRelationInputSchema.array(),AddressOrderByWithRelationInputSchema ]).optional(),
  cursor: AddressWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AddressScalarFieldEnumSchema,AddressScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AddressFindManyArgsSchema: z.ZodType<Prisma.AddressFindManyArgs> = z.object({
  select: AddressSelectSchema.optional(),
  include: AddressIncludeSchema.optional(),
  where: AddressWhereInputSchema.optional(),
  orderBy: z.union([ AddressOrderByWithRelationInputSchema.array(),AddressOrderByWithRelationInputSchema ]).optional(),
  cursor: AddressWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AddressScalarFieldEnumSchema,AddressScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AddressAggregateArgsSchema: z.ZodType<Prisma.AddressAggregateArgs> = z.object({
  where: AddressWhereInputSchema.optional(),
  orderBy: z.union([ AddressOrderByWithRelationInputSchema.array(),AddressOrderByWithRelationInputSchema ]).optional(),
  cursor: AddressWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AddressGroupByArgsSchema: z.ZodType<Prisma.AddressGroupByArgs> = z.object({
  where: AddressWhereInputSchema.optional(),
  orderBy: z.union([ AddressOrderByWithAggregationInputSchema.array(),AddressOrderByWithAggregationInputSchema ]).optional(),
  by: AddressScalarFieldEnumSchema.array(),
  having: AddressScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AddressFindUniqueArgsSchema: z.ZodType<Prisma.AddressFindUniqueArgs> = z.object({
  select: AddressSelectSchema.optional(),
  include: AddressIncludeSchema.optional(),
  where: AddressWhereUniqueInputSchema,
}).strict() ;

export const AddressFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AddressFindUniqueOrThrowArgs> = z.object({
  select: AddressSelectSchema.optional(),
  include: AddressIncludeSchema.optional(),
  where: AddressWhereUniqueInputSchema,
}).strict() ;

export const CartFindFirstArgsSchema: z.ZodType<Prisma.CartFindFirstArgs> = z.object({
  select: CartSelectSchema.optional(),
  include: CartIncludeSchema.optional(),
  where: CartWhereInputSchema.optional(),
  orderBy: z.union([ CartOrderByWithRelationInputSchema.array(),CartOrderByWithRelationInputSchema ]).optional(),
  cursor: CartWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CartScalarFieldEnumSchema,CartScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CartFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CartFindFirstOrThrowArgs> = z.object({
  select: CartSelectSchema.optional(),
  include: CartIncludeSchema.optional(),
  where: CartWhereInputSchema.optional(),
  orderBy: z.union([ CartOrderByWithRelationInputSchema.array(),CartOrderByWithRelationInputSchema ]).optional(),
  cursor: CartWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CartScalarFieldEnumSchema,CartScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CartFindManyArgsSchema: z.ZodType<Prisma.CartFindManyArgs> = z.object({
  select: CartSelectSchema.optional(),
  include: CartIncludeSchema.optional(),
  where: CartWhereInputSchema.optional(),
  orderBy: z.union([ CartOrderByWithRelationInputSchema.array(),CartOrderByWithRelationInputSchema ]).optional(),
  cursor: CartWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CartScalarFieldEnumSchema,CartScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CartAggregateArgsSchema: z.ZodType<Prisma.CartAggregateArgs> = z.object({
  where: CartWhereInputSchema.optional(),
  orderBy: z.union([ CartOrderByWithRelationInputSchema.array(),CartOrderByWithRelationInputSchema ]).optional(),
  cursor: CartWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CartGroupByArgsSchema: z.ZodType<Prisma.CartGroupByArgs> = z.object({
  where: CartWhereInputSchema.optional(),
  orderBy: z.union([ CartOrderByWithAggregationInputSchema.array(),CartOrderByWithAggregationInputSchema ]).optional(),
  by: CartScalarFieldEnumSchema.array(),
  having: CartScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CartFindUniqueArgsSchema: z.ZodType<Prisma.CartFindUniqueArgs> = z.object({
  select: CartSelectSchema.optional(),
  include: CartIncludeSchema.optional(),
  where: CartWhereUniqueInputSchema,
}).strict() ;

export const CartFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CartFindUniqueOrThrowArgs> = z.object({
  select: CartSelectSchema.optional(),
  include: CartIncludeSchema.optional(),
  where: CartWhereUniqueInputSchema,
}).strict() ;

export const CartItemFindFirstArgsSchema: z.ZodType<Prisma.CartItemFindFirstArgs> = z.object({
  select: CartItemSelectSchema.optional(),
  include: CartItemIncludeSchema.optional(),
  where: CartItemWhereInputSchema.optional(),
  orderBy: z.union([ CartItemOrderByWithRelationInputSchema.array(),CartItemOrderByWithRelationInputSchema ]).optional(),
  cursor: CartItemWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CartItemScalarFieldEnumSchema,CartItemScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CartItemFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CartItemFindFirstOrThrowArgs> = z.object({
  select: CartItemSelectSchema.optional(),
  include: CartItemIncludeSchema.optional(),
  where: CartItemWhereInputSchema.optional(),
  orderBy: z.union([ CartItemOrderByWithRelationInputSchema.array(),CartItemOrderByWithRelationInputSchema ]).optional(),
  cursor: CartItemWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CartItemScalarFieldEnumSchema,CartItemScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CartItemFindManyArgsSchema: z.ZodType<Prisma.CartItemFindManyArgs> = z.object({
  select: CartItemSelectSchema.optional(),
  include: CartItemIncludeSchema.optional(),
  where: CartItemWhereInputSchema.optional(),
  orderBy: z.union([ CartItemOrderByWithRelationInputSchema.array(),CartItemOrderByWithRelationInputSchema ]).optional(),
  cursor: CartItemWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CartItemScalarFieldEnumSchema,CartItemScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CartItemAggregateArgsSchema: z.ZodType<Prisma.CartItemAggregateArgs> = z.object({
  where: CartItemWhereInputSchema.optional(),
  orderBy: z.union([ CartItemOrderByWithRelationInputSchema.array(),CartItemOrderByWithRelationInputSchema ]).optional(),
  cursor: CartItemWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CartItemGroupByArgsSchema: z.ZodType<Prisma.CartItemGroupByArgs> = z.object({
  where: CartItemWhereInputSchema.optional(),
  orderBy: z.union([ CartItemOrderByWithAggregationInputSchema.array(),CartItemOrderByWithAggregationInputSchema ]).optional(),
  by: CartItemScalarFieldEnumSchema.array(),
  having: CartItemScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CartItemFindUniqueArgsSchema: z.ZodType<Prisma.CartItemFindUniqueArgs> = z.object({
  select: CartItemSelectSchema.optional(),
  include: CartItemIncludeSchema.optional(),
  where: CartItemWhereUniqueInputSchema,
}).strict() ;

export const CartItemFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CartItemFindUniqueOrThrowArgs> = z.object({
  select: CartItemSelectSchema.optional(),
  include: CartItemIncludeSchema.optional(),
  where: CartItemWhereUniqueInputSchema,
}).strict() ;

export const CategoryFindFirstArgsSchema: z.ZodType<Prisma.CategoryFindFirstArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereInputSchema.optional(),
  orderBy: z.union([ CategoryOrderByWithRelationInputSchema.array(),CategoryOrderByWithRelationInputSchema ]).optional(),
  cursor: CategoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CategoryScalarFieldEnumSchema,CategoryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CategoryFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CategoryFindFirstOrThrowArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereInputSchema.optional(),
  orderBy: z.union([ CategoryOrderByWithRelationInputSchema.array(),CategoryOrderByWithRelationInputSchema ]).optional(),
  cursor: CategoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CategoryScalarFieldEnumSchema,CategoryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CategoryFindManyArgsSchema: z.ZodType<Prisma.CategoryFindManyArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereInputSchema.optional(),
  orderBy: z.union([ CategoryOrderByWithRelationInputSchema.array(),CategoryOrderByWithRelationInputSchema ]).optional(),
  cursor: CategoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CategoryScalarFieldEnumSchema,CategoryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CategoryAggregateArgsSchema: z.ZodType<Prisma.CategoryAggregateArgs> = z.object({
  where: CategoryWhereInputSchema.optional(),
  orderBy: z.union([ CategoryOrderByWithRelationInputSchema.array(),CategoryOrderByWithRelationInputSchema ]).optional(),
  cursor: CategoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CategoryGroupByArgsSchema: z.ZodType<Prisma.CategoryGroupByArgs> = z.object({
  where: CategoryWhereInputSchema.optional(),
  orderBy: z.union([ CategoryOrderByWithAggregationInputSchema.array(),CategoryOrderByWithAggregationInputSchema ]).optional(),
  by: CategoryScalarFieldEnumSchema.array(),
  having: CategoryScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CategoryFindUniqueArgsSchema: z.ZodType<Prisma.CategoryFindUniqueArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereUniqueInputSchema,
}).strict() ;

export const CategoryFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CategoryFindUniqueOrThrowArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereUniqueInputSchema,
}).strict() ;

export const OrderFindFirstArgsSchema: z.ZodType<Prisma.OrderFindFirstArgs> = z.object({
  select: OrderSelectSchema.optional(),
  include: OrderIncludeSchema.optional(),
  where: OrderWhereInputSchema.optional(),
  orderBy: z.union([ OrderOrderByWithRelationInputSchema.array(),OrderOrderByWithRelationInputSchema ]).optional(),
  cursor: OrderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrderScalarFieldEnumSchema,OrderScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OrderFindFirstOrThrowArgsSchema: z.ZodType<Prisma.OrderFindFirstOrThrowArgs> = z.object({
  select: OrderSelectSchema.optional(),
  include: OrderIncludeSchema.optional(),
  where: OrderWhereInputSchema.optional(),
  orderBy: z.union([ OrderOrderByWithRelationInputSchema.array(),OrderOrderByWithRelationInputSchema ]).optional(),
  cursor: OrderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrderScalarFieldEnumSchema,OrderScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OrderFindManyArgsSchema: z.ZodType<Prisma.OrderFindManyArgs> = z.object({
  select: OrderSelectSchema.optional(),
  include: OrderIncludeSchema.optional(),
  where: OrderWhereInputSchema.optional(),
  orderBy: z.union([ OrderOrderByWithRelationInputSchema.array(),OrderOrderByWithRelationInputSchema ]).optional(),
  cursor: OrderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrderScalarFieldEnumSchema,OrderScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OrderAggregateArgsSchema: z.ZodType<Prisma.OrderAggregateArgs> = z.object({
  where: OrderWhereInputSchema.optional(),
  orderBy: z.union([ OrderOrderByWithRelationInputSchema.array(),OrderOrderByWithRelationInputSchema ]).optional(),
  cursor: OrderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const OrderGroupByArgsSchema: z.ZodType<Prisma.OrderGroupByArgs> = z.object({
  where: OrderWhereInputSchema.optional(),
  orderBy: z.union([ OrderOrderByWithAggregationInputSchema.array(),OrderOrderByWithAggregationInputSchema ]).optional(),
  by: OrderScalarFieldEnumSchema.array(),
  having: OrderScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const OrderFindUniqueArgsSchema: z.ZodType<Prisma.OrderFindUniqueArgs> = z.object({
  select: OrderSelectSchema.optional(),
  include: OrderIncludeSchema.optional(),
  where: OrderWhereUniqueInputSchema,
}).strict() ;

export const OrderFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.OrderFindUniqueOrThrowArgs> = z.object({
  select: OrderSelectSchema.optional(),
  include: OrderIncludeSchema.optional(),
  where: OrderWhereUniqueInputSchema,
}).strict() ;

export const OrderItemFindFirstArgsSchema: z.ZodType<Prisma.OrderItemFindFirstArgs> = z.object({
  select: OrderItemSelectSchema.optional(),
  include: OrderItemIncludeSchema.optional(),
  where: OrderItemWhereInputSchema.optional(),
  orderBy: z.union([ OrderItemOrderByWithRelationInputSchema.array(),OrderItemOrderByWithRelationInputSchema ]).optional(),
  cursor: OrderItemWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrderItemScalarFieldEnumSchema,OrderItemScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OrderItemFindFirstOrThrowArgsSchema: z.ZodType<Prisma.OrderItemFindFirstOrThrowArgs> = z.object({
  select: OrderItemSelectSchema.optional(),
  include: OrderItemIncludeSchema.optional(),
  where: OrderItemWhereInputSchema.optional(),
  orderBy: z.union([ OrderItemOrderByWithRelationInputSchema.array(),OrderItemOrderByWithRelationInputSchema ]).optional(),
  cursor: OrderItemWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrderItemScalarFieldEnumSchema,OrderItemScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OrderItemFindManyArgsSchema: z.ZodType<Prisma.OrderItemFindManyArgs> = z.object({
  select: OrderItemSelectSchema.optional(),
  include: OrderItemIncludeSchema.optional(),
  where: OrderItemWhereInputSchema.optional(),
  orderBy: z.union([ OrderItemOrderByWithRelationInputSchema.array(),OrderItemOrderByWithRelationInputSchema ]).optional(),
  cursor: OrderItemWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrderItemScalarFieldEnumSchema,OrderItemScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OrderItemAggregateArgsSchema: z.ZodType<Prisma.OrderItemAggregateArgs> = z.object({
  where: OrderItemWhereInputSchema.optional(),
  orderBy: z.union([ OrderItemOrderByWithRelationInputSchema.array(),OrderItemOrderByWithRelationInputSchema ]).optional(),
  cursor: OrderItemWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const OrderItemGroupByArgsSchema: z.ZodType<Prisma.OrderItemGroupByArgs> = z.object({
  where: OrderItemWhereInputSchema.optional(),
  orderBy: z.union([ OrderItemOrderByWithAggregationInputSchema.array(),OrderItemOrderByWithAggregationInputSchema ]).optional(),
  by: OrderItemScalarFieldEnumSchema.array(),
  having: OrderItemScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const OrderItemFindUniqueArgsSchema: z.ZodType<Prisma.OrderItemFindUniqueArgs> = z.object({
  select: OrderItemSelectSchema.optional(),
  include: OrderItemIncludeSchema.optional(),
  where: OrderItemWhereUniqueInputSchema,
}).strict() ;

export const OrderItemFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.OrderItemFindUniqueOrThrowArgs> = z.object({
  select: OrderItemSelectSchema.optional(),
  include: OrderItemIncludeSchema.optional(),
  where: OrderItemWhereUniqueInputSchema,
}).strict() ;

export const ProductFindFirstArgsSchema: z.ZodType<Prisma.ProductFindFirstArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereInputSchema.optional(),
  orderBy: z.union([ ProductOrderByWithRelationInputSchema.array(),ProductOrderByWithRelationInputSchema ]).optional(),
  cursor: ProductWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProductScalarFieldEnumSchema,ProductScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProductFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ProductFindFirstOrThrowArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereInputSchema.optional(),
  orderBy: z.union([ ProductOrderByWithRelationInputSchema.array(),ProductOrderByWithRelationInputSchema ]).optional(),
  cursor: ProductWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProductScalarFieldEnumSchema,ProductScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProductFindManyArgsSchema: z.ZodType<Prisma.ProductFindManyArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereInputSchema.optional(),
  orderBy: z.union([ ProductOrderByWithRelationInputSchema.array(),ProductOrderByWithRelationInputSchema ]).optional(),
  cursor: ProductWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProductScalarFieldEnumSchema,ProductScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProductAggregateArgsSchema: z.ZodType<Prisma.ProductAggregateArgs> = z.object({
  where: ProductWhereInputSchema.optional(),
  orderBy: z.union([ ProductOrderByWithRelationInputSchema.array(),ProductOrderByWithRelationInputSchema ]).optional(),
  cursor: ProductWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProductGroupByArgsSchema: z.ZodType<Prisma.ProductGroupByArgs> = z.object({
  where: ProductWhereInputSchema.optional(),
  orderBy: z.union([ ProductOrderByWithAggregationInputSchema.array(),ProductOrderByWithAggregationInputSchema ]).optional(),
  by: ProductScalarFieldEnumSchema.array(),
  having: ProductScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProductFindUniqueArgsSchema: z.ZodType<Prisma.ProductFindUniqueArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereUniqueInputSchema,
}).strict() ;

export const ProductFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ProductFindUniqueOrThrowArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereUniqueInputSchema,
}).strict() ;

export const PromoCodeFindFirstArgsSchema: z.ZodType<Prisma.PromoCodeFindFirstArgs> = z.object({
  select: PromoCodeSelectSchema.optional(),
  include: PromoCodeIncludeSchema.optional(),
  where: PromoCodeWhereInputSchema.optional(),
  orderBy: z.union([ PromoCodeOrderByWithRelationInputSchema.array(),PromoCodeOrderByWithRelationInputSchema ]).optional(),
  cursor: PromoCodeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PromoCodeScalarFieldEnumSchema,PromoCodeScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PromoCodeFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PromoCodeFindFirstOrThrowArgs> = z.object({
  select: PromoCodeSelectSchema.optional(),
  include: PromoCodeIncludeSchema.optional(),
  where: PromoCodeWhereInputSchema.optional(),
  orderBy: z.union([ PromoCodeOrderByWithRelationInputSchema.array(),PromoCodeOrderByWithRelationInputSchema ]).optional(),
  cursor: PromoCodeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PromoCodeScalarFieldEnumSchema,PromoCodeScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PromoCodeFindManyArgsSchema: z.ZodType<Prisma.PromoCodeFindManyArgs> = z.object({
  select: PromoCodeSelectSchema.optional(),
  include: PromoCodeIncludeSchema.optional(),
  where: PromoCodeWhereInputSchema.optional(),
  orderBy: z.union([ PromoCodeOrderByWithRelationInputSchema.array(),PromoCodeOrderByWithRelationInputSchema ]).optional(),
  cursor: PromoCodeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PromoCodeScalarFieldEnumSchema,PromoCodeScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PromoCodeAggregateArgsSchema: z.ZodType<Prisma.PromoCodeAggregateArgs> = z.object({
  where: PromoCodeWhereInputSchema.optional(),
  orderBy: z.union([ PromoCodeOrderByWithRelationInputSchema.array(),PromoCodeOrderByWithRelationInputSchema ]).optional(),
  cursor: PromoCodeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PromoCodeGroupByArgsSchema: z.ZodType<Prisma.PromoCodeGroupByArgs> = z.object({
  where: PromoCodeWhereInputSchema.optional(),
  orderBy: z.union([ PromoCodeOrderByWithAggregationInputSchema.array(),PromoCodeOrderByWithAggregationInputSchema ]).optional(),
  by: PromoCodeScalarFieldEnumSchema.array(),
  having: PromoCodeScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PromoCodeFindUniqueArgsSchema: z.ZodType<Prisma.PromoCodeFindUniqueArgs> = z.object({
  select: PromoCodeSelectSchema.optional(),
  include: PromoCodeIncludeSchema.optional(),
  where: PromoCodeWhereUniqueInputSchema,
}).strict() ;

export const PromoCodeFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PromoCodeFindUniqueOrThrowArgs> = z.object({
  select: PromoCodeSelectSchema.optional(),
  include: PromoCodeIncludeSchema.optional(),
  where: PromoCodeWhereUniqueInputSchema,
}).strict() ;

export const ReturnFindFirstArgsSchema: z.ZodType<Prisma.ReturnFindFirstArgs> = z.object({
  select: ReturnSelectSchema.optional(),
  include: ReturnIncludeSchema.optional(),
  where: ReturnWhereInputSchema.optional(),
  orderBy: z.union([ ReturnOrderByWithRelationInputSchema.array(),ReturnOrderByWithRelationInputSchema ]).optional(),
  cursor: ReturnWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ReturnScalarFieldEnumSchema,ReturnScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ReturnFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ReturnFindFirstOrThrowArgs> = z.object({
  select: ReturnSelectSchema.optional(),
  include: ReturnIncludeSchema.optional(),
  where: ReturnWhereInputSchema.optional(),
  orderBy: z.union([ ReturnOrderByWithRelationInputSchema.array(),ReturnOrderByWithRelationInputSchema ]).optional(),
  cursor: ReturnWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ReturnScalarFieldEnumSchema,ReturnScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ReturnFindManyArgsSchema: z.ZodType<Prisma.ReturnFindManyArgs> = z.object({
  select: ReturnSelectSchema.optional(),
  include: ReturnIncludeSchema.optional(),
  where: ReturnWhereInputSchema.optional(),
  orderBy: z.union([ ReturnOrderByWithRelationInputSchema.array(),ReturnOrderByWithRelationInputSchema ]).optional(),
  cursor: ReturnWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ReturnScalarFieldEnumSchema,ReturnScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ReturnAggregateArgsSchema: z.ZodType<Prisma.ReturnAggregateArgs> = z.object({
  where: ReturnWhereInputSchema.optional(),
  orderBy: z.union([ ReturnOrderByWithRelationInputSchema.array(),ReturnOrderByWithRelationInputSchema ]).optional(),
  cursor: ReturnWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ReturnGroupByArgsSchema: z.ZodType<Prisma.ReturnGroupByArgs> = z.object({
  where: ReturnWhereInputSchema.optional(),
  orderBy: z.union([ ReturnOrderByWithAggregationInputSchema.array(),ReturnOrderByWithAggregationInputSchema ]).optional(),
  by: ReturnScalarFieldEnumSchema.array(),
  having: ReturnScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ReturnFindUniqueArgsSchema: z.ZodType<Prisma.ReturnFindUniqueArgs> = z.object({
  select: ReturnSelectSchema.optional(),
  include: ReturnIncludeSchema.optional(),
  where: ReturnWhereUniqueInputSchema,
}).strict() ;

export const ReturnFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ReturnFindUniqueOrThrowArgs> = z.object({
  select: ReturnSelectSchema.optional(),
  include: ReturnIncludeSchema.optional(),
  where: ReturnWhereUniqueInputSchema,
}).strict() ;

export const ReviewFindFirstArgsSchema: z.ZodType<Prisma.ReviewFindFirstArgs> = z.object({
  select: ReviewSelectSchema.optional(),
  include: ReviewIncludeSchema.optional(),
  where: ReviewWhereInputSchema.optional(),
  orderBy: z.union([ ReviewOrderByWithRelationInputSchema.array(),ReviewOrderByWithRelationInputSchema ]).optional(),
  cursor: ReviewWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ReviewScalarFieldEnumSchema,ReviewScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ReviewFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ReviewFindFirstOrThrowArgs> = z.object({
  select: ReviewSelectSchema.optional(),
  include: ReviewIncludeSchema.optional(),
  where: ReviewWhereInputSchema.optional(),
  orderBy: z.union([ ReviewOrderByWithRelationInputSchema.array(),ReviewOrderByWithRelationInputSchema ]).optional(),
  cursor: ReviewWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ReviewScalarFieldEnumSchema,ReviewScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ReviewFindManyArgsSchema: z.ZodType<Prisma.ReviewFindManyArgs> = z.object({
  select: ReviewSelectSchema.optional(),
  include: ReviewIncludeSchema.optional(),
  where: ReviewWhereInputSchema.optional(),
  orderBy: z.union([ ReviewOrderByWithRelationInputSchema.array(),ReviewOrderByWithRelationInputSchema ]).optional(),
  cursor: ReviewWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ReviewScalarFieldEnumSchema,ReviewScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ReviewAggregateArgsSchema: z.ZodType<Prisma.ReviewAggregateArgs> = z.object({
  where: ReviewWhereInputSchema.optional(),
  orderBy: z.union([ ReviewOrderByWithRelationInputSchema.array(),ReviewOrderByWithRelationInputSchema ]).optional(),
  cursor: ReviewWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ReviewGroupByArgsSchema: z.ZodType<Prisma.ReviewGroupByArgs> = z.object({
  where: ReviewWhereInputSchema.optional(),
  orderBy: z.union([ ReviewOrderByWithAggregationInputSchema.array(),ReviewOrderByWithAggregationInputSchema ]).optional(),
  by: ReviewScalarFieldEnumSchema.array(),
  having: ReviewScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ReviewFindUniqueArgsSchema: z.ZodType<Prisma.ReviewFindUniqueArgs> = z.object({
  select: ReviewSelectSchema.optional(),
  include: ReviewIncludeSchema.optional(),
  where: ReviewWhereUniqueInputSchema,
}).strict() ;

export const ReviewFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ReviewFindUniqueOrThrowArgs> = z.object({
  select: ReviewSelectSchema.optional(),
  include: ReviewIncludeSchema.optional(),
  where: ReviewWhereUniqueInputSchema,
}).strict() ;

export const searchFindFirstArgsSchema: z.ZodType<Prisma.searchFindFirstArgs> = z.object({
  select: searchSelectSchema.optional(),
  include: searchIncludeSchema.optional(),
  where: searchWhereInputSchema.optional(),
  orderBy: z.union([ searchOrderByWithRelationInputSchema.array(),searchOrderByWithRelationInputSchema ]).optional(),
  cursor: searchWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SearchScalarFieldEnumSchema,SearchScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const searchFindFirstOrThrowArgsSchema: z.ZodType<Prisma.searchFindFirstOrThrowArgs> = z.object({
  select: searchSelectSchema.optional(),
  include: searchIncludeSchema.optional(),
  where: searchWhereInputSchema.optional(),
  orderBy: z.union([ searchOrderByWithRelationInputSchema.array(),searchOrderByWithRelationInputSchema ]).optional(),
  cursor: searchWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SearchScalarFieldEnumSchema,SearchScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const searchFindManyArgsSchema: z.ZodType<Prisma.searchFindManyArgs> = z.object({
  select: searchSelectSchema.optional(),
  include: searchIncludeSchema.optional(),
  where: searchWhereInputSchema.optional(),
  orderBy: z.union([ searchOrderByWithRelationInputSchema.array(),searchOrderByWithRelationInputSchema ]).optional(),
  cursor: searchWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SearchScalarFieldEnumSchema,SearchScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const searchAggregateArgsSchema: z.ZodType<Prisma.SearchAggregateArgs> = z.object({
  where: searchWhereInputSchema.optional(),
  orderBy: z.union([ searchOrderByWithRelationInputSchema.array(),searchOrderByWithRelationInputSchema ]).optional(),
  cursor: searchWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const searchGroupByArgsSchema: z.ZodType<Prisma.searchGroupByArgs> = z.object({
  where: searchWhereInputSchema.optional(),
  orderBy: z.union([ searchOrderByWithAggregationInputSchema.array(),searchOrderByWithAggregationInputSchema ]).optional(),
  by: SearchScalarFieldEnumSchema.array(),
  having: searchScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const searchFindUniqueArgsSchema: z.ZodType<Prisma.searchFindUniqueArgs> = z.object({
  select: searchSelectSchema.optional(),
  include: searchIncludeSchema.optional(),
  where: searchWhereUniqueInputSchema,
}).strict() ;

export const searchFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.searchFindUniqueOrThrowArgs> = z.object({
  select: searchSelectSchema.optional(),
  include: searchIncludeSchema.optional(),
  where: searchWhereUniqueInputSchema,
}).strict() ;

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(),UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(),
  having: UserScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const AddressCreateArgsSchema: z.ZodType<Prisma.AddressCreateArgs> = z.object({
  select: AddressSelectSchema.optional(),
  include: AddressIncludeSchema.optional(),
  data: z.union([ AddressCreateInputSchema,AddressUncheckedCreateInputSchema ]),
}).strict() ;

export const AddressUpsertArgsSchema: z.ZodType<Prisma.AddressUpsertArgs> = z.object({
  select: AddressSelectSchema.optional(),
  include: AddressIncludeSchema.optional(),
  where: AddressWhereUniqueInputSchema,
  create: z.union([ AddressCreateInputSchema,AddressUncheckedCreateInputSchema ]),
  update: z.union([ AddressUpdateInputSchema,AddressUncheckedUpdateInputSchema ]),
}).strict() ;

export const AddressCreateManyArgsSchema: z.ZodType<Prisma.AddressCreateManyArgs> = z.object({
  data: z.union([ AddressCreateManyInputSchema,AddressCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AddressCreateManyAndReturnArgsSchema: z.ZodType<Prisma.AddressCreateManyAndReturnArgs> = z.object({
  data: z.union([ AddressCreateManyInputSchema,AddressCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AddressDeleteArgsSchema: z.ZodType<Prisma.AddressDeleteArgs> = z.object({
  select: AddressSelectSchema.optional(),
  include: AddressIncludeSchema.optional(),
  where: AddressWhereUniqueInputSchema,
}).strict() ;

export const AddressUpdateArgsSchema: z.ZodType<Prisma.AddressUpdateArgs> = z.object({
  select: AddressSelectSchema.optional(),
  include: AddressIncludeSchema.optional(),
  data: z.union([ AddressUpdateInputSchema,AddressUncheckedUpdateInputSchema ]),
  where: AddressWhereUniqueInputSchema,
}).strict() ;

export const AddressUpdateManyArgsSchema: z.ZodType<Prisma.AddressUpdateManyArgs> = z.object({
  data: z.union([ AddressUpdateManyMutationInputSchema,AddressUncheckedUpdateManyInputSchema ]),
  where: AddressWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const AddressUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.AddressUpdateManyAndReturnArgs> = z.object({
  data: z.union([ AddressUpdateManyMutationInputSchema,AddressUncheckedUpdateManyInputSchema ]),
  where: AddressWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const AddressDeleteManyArgsSchema: z.ZodType<Prisma.AddressDeleteManyArgs> = z.object({
  where: AddressWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const CartCreateArgsSchema: z.ZodType<Prisma.CartCreateArgs> = z.object({
  select: CartSelectSchema.optional(),
  include: CartIncludeSchema.optional(),
  data: z.union([ CartCreateInputSchema,CartUncheckedCreateInputSchema ]).optional(),
}).strict() ;

export const CartUpsertArgsSchema: z.ZodType<Prisma.CartUpsertArgs> = z.object({
  select: CartSelectSchema.optional(),
  include: CartIncludeSchema.optional(),
  where: CartWhereUniqueInputSchema,
  create: z.union([ CartCreateInputSchema,CartUncheckedCreateInputSchema ]),
  update: z.union([ CartUpdateInputSchema,CartUncheckedUpdateInputSchema ]),
}).strict() ;

export const CartCreateManyArgsSchema: z.ZodType<Prisma.CartCreateManyArgs> = z.object({
  data: z.union([ CartCreateManyInputSchema,CartCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CartCreateManyAndReturnArgsSchema: z.ZodType<Prisma.CartCreateManyAndReturnArgs> = z.object({
  data: z.union([ CartCreateManyInputSchema,CartCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CartDeleteArgsSchema: z.ZodType<Prisma.CartDeleteArgs> = z.object({
  select: CartSelectSchema.optional(),
  include: CartIncludeSchema.optional(),
  where: CartWhereUniqueInputSchema,
}).strict() ;

export const CartUpdateArgsSchema: z.ZodType<Prisma.CartUpdateArgs> = z.object({
  select: CartSelectSchema.optional(),
  include: CartIncludeSchema.optional(),
  data: z.union([ CartUpdateInputSchema,CartUncheckedUpdateInputSchema ]),
  where: CartWhereUniqueInputSchema,
}).strict() ;

export const CartUpdateManyArgsSchema: z.ZodType<Prisma.CartUpdateManyArgs> = z.object({
  data: z.union([ CartUpdateManyMutationInputSchema,CartUncheckedUpdateManyInputSchema ]),
  where: CartWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const CartUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.CartUpdateManyAndReturnArgs> = z.object({
  data: z.union([ CartUpdateManyMutationInputSchema,CartUncheckedUpdateManyInputSchema ]),
  where: CartWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const CartDeleteManyArgsSchema: z.ZodType<Prisma.CartDeleteManyArgs> = z.object({
  where: CartWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const CartItemCreateArgsSchema: z.ZodType<Prisma.CartItemCreateArgs> = z.object({
  select: CartItemSelectSchema.optional(),
  include: CartItemIncludeSchema.optional(),
  data: z.union([ CartItemCreateInputSchema,CartItemUncheckedCreateInputSchema ]),
}).strict() ;

export const CartItemUpsertArgsSchema: z.ZodType<Prisma.CartItemUpsertArgs> = z.object({
  select: CartItemSelectSchema.optional(),
  include: CartItemIncludeSchema.optional(),
  where: CartItemWhereUniqueInputSchema,
  create: z.union([ CartItemCreateInputSchema,CartItemUncheckedCreateInputSchema ]),
  update: z.union([ CartItemUpdateInputSchema,CartItemUncheckedUpdateInputSchema ]),
}).strict() ;

export const CartItemCreateManyArgsSchema: z.ZodType<Prisma.CartItemCreateManyArgs> = z.object({
  data: z.union([ CartItemCreateManyInputSchema,CartItemCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CartItemCreateManyAndReturnArgsSchema: z.ZodType<Prisma.CartItemCreateManyAndReturnArgs> = z.object({
  data: z.union([ CartItemCreateManyInputSchema,CartItemCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CartItemDeleteArgsSchema: z.ZodType<Prisma.CartItemDeleteArgs> = z.object({
  select: CartItemSelectSchema.optional(),
  include: CartItemIncludeSchema.optional(),
  where: CartItemWhereUniqueInputSchema,
}).strict() ;

export const CartItemUpdateArgsSchema: z.ZodType<Prisma.CartItemUpdateArgs> = z.object({
  select: CartItemSelectSchema.optional(),
  include: CartItemIncludeSchema.optional(),
  data: z.union([ CartItemUpdateInputSchema,CartItemUncheckedUpdateInputSchema ]),
  where: CartItemWhereUniqueInputSchema,
}).strict() ;

export const CartItemUpdateManyArgsSchema: z.ZodType<Prisma.CartItemUpdateManyArgs> = z.object({
  data: z.union([ CartItemUpdateManyMutationInputSchema,CartItemUncheckedUpdateManyInputSchema ]),
  where: CartItemWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const CartItemUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.CartItemUpdateManyAndReturnArgs> = z.object({
  data: z.union([ CartItemUpdateManyMutationInputSchema,CartItemUncheckedUpdateManyInputSchema ]),
  where: CartItemWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const CartItemDeleteManyArgsSchema: z.ZodType<Prisma.CartItemDeleteManyArgs> = z.object({
  where: CartItemWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const CategoryCreateArgsSchema: z.ZodType<Prisma.CategoryCreateArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  data: z.union([ CategoryCreateInputSchema,CategoryUncheckedCreateInputSchema ]),
}).strict() ;

export const CategoryUpsertArgsSchema: z.ZodType<Prisma.CategoryUpsertArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereUniqueInputSchema,
  create: z.union([ CategoryCreateInputSchema,CategoryUncheckedCreateInputSchema ]),
  update: z.union([ CategoryUpdateInputSchema,CategoryUncheckedUpdateInputSchema ]),
}).strict() ;

export const CategoryCreateManyArgsSchema: z.ZodType<Prisma.CategoryCreateManyArgs> = z.object({
  data: z.union([ CategoryCreateManyInputSchema,CategoryCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CategoryCreateManyAndReturnArgsSchema: z.ZodType<Prisma.CategoryCreateManyAndReturnArgs> = z.object({
  data: z.union([ CategoryCreateManyInputSchema,CategoryCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CategoryDeleteArgsSchema: z.ZodType<Prisma.CategoryDeleteArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereUniqueInputSchema,
}).strict() ;

export const CategoryUpdateArgsSchema: z.ZodType<Prisma.CategoryUpdateArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  data: z.union([ CategoryUpdateInputSchema,CategoryUncheckedUpdateInputSchema ]),
  where: CategoryWhereUniqueInputSchema,
}).strict() ;

export const CategoryUpdateManyArgsSchema: z.ZodType<Prisma.CategoryUpdateManyArgs> = z.object({
  data: z.union([ CategoryUpdateManyMutationInputSchema,CategoryUncheckedUpdateManyInputSchema ]),
  where: CategoryWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const CategoryUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.CategoryUpdateManyAndReturnArgs> = z.object({
  data: z.union([ CategoryUpdateManyMutationInputSchema,CategoryUncheckedUpdateManyInputSchema ]),
  where: CategoryWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const CategoryDeleteManyArgsSchema: z.ZodType<Prisma.CategoryDeleteManyArgs> = z.object({
  where: CategoryWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const OrderCreateArgsSchema: z.ZodType<Prisma.OrderCreateArgs> = z.object({
  select: OrderSelectSchema.optional(),
  include: OrderIncludeSchema.optional(),
  data: z.union([ OrderCreateInputSchema,OrderUncheckedCreateInputSchema ]),
}).strict() ;

export const OrderUpsertArgsSchema: z.ZodType<Prisma.OrderUpsertArgs> = z.object({
  select: OrderSelectSchema.optional(),
  include: OrderIncludeSchema.optional(),
  where: OrderWhereUniqueInputSchema,
  create: z.union([ OrderCreateInputSchema,OrderUncheckedCreateInputSchema ]),
  update: z.union([ OrderUpdateInputSchema,OrderUncheckedUpdateInputSchema ]),
}).strict() ;

export const OrderCreateManyArgsSchema: z.ZodType<Prisma.OrderCreateManyArgs> = z.object({
  data: z.union([ OrderCreateManyInputSchema,OrderCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const OrderCreateManyAndReturnArgsSchema: z.ZodType<Prisma.OrderCreateManyAndReturnArgs> = z.object({
  data: z.union([ OrderCreateManyInputSchema,OrderCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const OrderDeleteArgsSchema: z.ZodType<Prisma.OrderDeleteArgs> = z.object({
  select: OrderSelectSchema.optional(),
  include: OrderIncludeSchema.optional(),
  where: OrderWhereUniqueInputSchema,
}).strict() ;

export const OrderUpdateArgsSchema: z.ZodType<Prisma.OrderUpdateArgs> = z.object({
  select: OrderSelectSchema.optional(),
  include: OrderIncludeSchema.optional(),
  data: z.union([ OrderUpdateInputSchema,OrderUncheckedUpdateInputSchema ]),
  where: OrderWhereUniqueInputSchema,
}).strict() ;

export const OrderUpdateManyArgsSchema: z.ZodType<Prisma.OrderUpdateManyArgs> = z.object({
  data: z.union([ OrderUpdateManyMutationInputSchema,OrderUncheckedUpdateManyInputSchema ]),
  where: OrderWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const OrderUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.OrderUpdateManyAndReturnArgs> = z.object({
  data: z.union([ OrderUpdateManyMutationInputSchema,OrderUncheckedUpdateManyInputSchema ]),
  where: OrderWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const OrderDeleteManyArgsSchema: z.ZodType<Prisma.OrderDeleteManyArgs> = z.object({
  where: OrderWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const OrderItemCreateArgsSchema: z.ZodType<Prisma.OrderItemCreateArgs> = z.object({
  select: OrderItemSelectSchema.optional(),
  include: OrderItemIncludeSchema.optional(),
  data: z.union([ OrderItemCreateInputSchema,OrderItemUncheckedCreateInputSchema ]),
}).strict() ;

export const OrderItemUpsertArgsSchema: z.ZodType<Prisma.OrderItemUpsertArgs> = z.object({
  select: OrderItemSelectSchema.optional(),
  include: OrderItemIncludeSchema.optional(),
  where: OrderItemWhereUniqueInputSchema,
  create: z.union([ OrderItemCreateInputSchema,OrderItemUncheckedCreateInputSchema ]),
  update: z.union([ OrderItemUpdateInputSchema,OrderItemUncheckedUpdateInputSchema ]),
}).strict() ;

export const OrderItemCreateManyArgsSchema: z.ZodType<Prisma.OrderItemCreateManyArgs> = z.object({
  data: z.union([ OrderItemCreateManyInputSchema,OrderItemCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const OrderItemCreateManyAndReturnArgsSchema: z.ZodType<Prisma.OrderItemCreateManyAndReturnArgs> = z.object({
  data: z.union([ OrderItemCreateManyInputSchema,OrderItemCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const OrderItemDeleteArgsSchema: z.ZodType<Prisma.OrderItemDeleteArgs> = z.object({
  select: OrderItemSelectSchema.optional(),
  include: OrderItemIncludeSchema.optional(),
  where: OrderItemWhereUniqueInputSchema,
}).strict() ;

export const OrderItemUpdateArgsSchema: z.ZodType<Prisma.OrderItemUpdateArgs> = z.object({
  select: OrderItemSelectSchema.optional(),
  include: OrderItemIncludeSchema.optional(),
  data: z.union([ OrderItemUpdateInputSchema,OrderItemUncheckedUpdateInputSchema ]),
  where: OrderItemWhereUniqueInputSchema,
}).strict() ;

export const OrderItemUpdateManyArgsSchema: z.ZodType<Prisma.OrderItemUpdateManyArgs> = z.object({
  data: z.union([ OrderItemUpdateManyMutationInputSchema,OrderItemUncheckedUpdateManyInputSchema ]),
  where: OrderItemWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const OrderItemUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.OrderItemUpdateManyAndReturnArgs> = z.object({
  data: z.union([ OrderItemUpdateManyMutationInputSchema,OrderItemUncheckedUpdateManyInputSchema ]),
  where: OrderItemWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const OrderItemDeleteManyArgsSchema: z.ZodType<Prisma.OrderItemDeleteManyArgs> = z.object({
  where: OrderItemWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ProductCreateArgsSchema: z.ZodType<Prisma.ProductCreateArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  data: z.union([ ProductCreateInputSchema,ProductUncheckedCreateInputSchema ]),
}).strict() ;

export const ProductUpsertArgsSchema: z.ZodType<Prisma.ProductUpsertArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereUniqueInputSchema,
  create: z.union([ ProductCreateInputSchema,ProductUncheckedCreateInputSchema ]),
  update: z.union([ ProductUpdateInputSchema,ProductUncheckedUpdateInputSchema ]),
}).strict() ;

export const ProductCreateManyArgsSchema: z.ZodType<Prisma.ProductCreateManyArgs> = z.object({
  data: z.union([ ProductCreateManyInputSchema,ProductCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ProductCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ProductCreateManyAndReturnArgs> = z.object({
  data: z.union([ ProductCreateManyInputSchema,ProductCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ProductDeleteArgsSchema: z.ZodType<Prisma.ProductDeleteArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereUniqueInputSchema,
}).strict() ;

export const ProductUpdateArgsSchema: z.ZodType<Prisma.ProductUpdateArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  data: z.union([ ProductUpdateInputSchema,ProductUncheckedUpdateInputSchema ]),
  where: ProductWhereUniqueInputSchema,
}).strict() ;

export const ProductUpdateManyArgsSchema: z.ZodType<Prisma.ProductUpdateManyArgs> = z.object({
  data: z.union([ ProductUpdateManyMutationInputSchema,ProductUncheckedUpdateManyInputSchema ]),
  where: ProductWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ProductUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.ProductUpdateManyAndReturnArgs> = z.object({
  data: z.union([ ProductUpdateManyMutationInputSchema,ProductUncheckedUpdateManyInputSchema ]),
  where: ProductWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ProductDeleteManyArgsSchema: z.ZodType<Prisma.ProductDeleteManyArgs> = z.object({
  where: ProductWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const PromoCodeCreateArgsSchema: z.ZodType<Prisma.PromoCodeCreateArgs> = z.object({
  select: PromoCodeSelectSchema.optional(),
  include: PromoCodeIncludeSchema.optional(),
  data: z.union([ PromoCodeCreateInputSchema,PromoCodeUncheckedCreateInputSchema ]),
}).strict() ;

export const PromoCodeUpsertArgsSchema: z.ZodType<Prisma.PromoCodeUpsertArgs> = z.object({
  select: PromoCodeSelectSchema.optional(),
  include: PromoCodeIncludeSchema.optional(),
  where: PromoCodeWhereUniqueInputSchema,
  create: z.union([ PromoCodeCreateInputSchema,PromoCodeUncheckedCreateInputSchema ]),
  update: z.union([ PromoCodeUpdateInputSchema,PromoCodeUncheckedUpdateInputSchema ]),
}).strict() ;

export const PromoCodeCreateManyArgsSchema: z.ZodType<Prisma.PromoCodeCreateManyArgs> = z.object({
  data: z.union([ PromoCodeCreateManyInputSchema,PromoCodeCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PromoCodeCreateManyAndReturnArgsSchema: z.ZodType<Prisma.PromoCodeCreateManyAndReturnArgs> = z.object({
  data: z.union([ PromoCodeCreateManyInputSchema,PromoCodeCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PromoCodeDeleteArgsSchema: z.ZodType<Prisma.PromoCodeDeleteArgs> = z.object({
  select: PromoCodeSelectSchema.optional(),
  include: PromoCodeIncludeSchema.optional(),
  where: PromoCodeWhereUniqueInputSchema,
}).strict() ;

export const PromoCodeUpdateArgsSchema: z.ZodType<Prisma.PromoCodeUpdateArgs> = z.object({
  select: PromoCodeSelectSchema.optional(),
  include: PromoCodeIncludeSchema.optional(),
  data: z.union([ PromoCodeUpdateInputSchema,PromoCodeUncheckedUpdateInputSchema ]),
  where: PromoCodeWhereUniqueInputSchema,
}).strict() ;

export const PromoCodeUpdateManyArgsSchema: z.ZodType<Prisma.PromoCodeUpdateManyArgs> = z.object({
  data: z.union([ PromoCodeUpdateManyMutationInputSchema,PromoCodeUncheckedUpdateManyInputSchema ]),
  where: PromoCodeWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const PromoCodeUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.PromoCodeUpdateManyAndReturnArgs> = z.object({
  data: z.union([ PromoCodeUpdateManyMutationInputSchema,PromoCodeUncheckedUpdateManyInputSchema ]),
  where: PromoCodeWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const PromoCodeDeleteManyArgsSchema: z.ZodType<Prisma.PromoCodeDeleteManyArgs> = z.object({
  where: PromoCodeWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ReturnCreateArgsSchema: z.ZodType<Prisma.ReturnCreateArgs> = z.object({
  select: ReturnSelectSchema.optional(),
  include: ReturnIncludeSchema.optional(),
  data: z.union([ ReturnCreateInputSchema,ReturnUncheckedCreateInputSchema ]),
}).strict() ;

export const ReturnUpsertArgsSchema: z.ZodType<Prisma.ReturnUpsertArgs> = z.object({
  select: ReturnSelectSchema.optional(),
  include: ReturnIncludeSchema.optional(),
  where: ReturnWhereUniqueInputSchema,
  create: z.union([ ReturnCreateInputSchema,ReturnUncheckedCreateInputSchema ]),
  update: z.union([ ReturnUpdateInputSchema,ReturnUncheckedUpdateInputSchema ]),
}).strict() ;

export const ReturnCreateManyArgsSchema: z.ZodType<Prisma.ReturnCreateManyArgs> = z.object({
  data: z.union([ ReturnCreateManyInputSchema,ReturnCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ReturnCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ReturnCreateManyAndReturnArgs> = z.object({
  data: z.union([ ReturnCreateManyInputSchema,ReturnCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ReturnDeleteArgsSchema: z.ZodType<Prisma.ReturnDeleteArgs> = z.object({
  select: ReturnSelectSchema.optional(),
  include: ReturnIncludeSchema.optional(),
  where: ReturnWhereUniqueInputSchema,
}).strict() ;

export const ReturnUpdateArgsSchema: z.ZodType<Prisma.ReturnUpdateArgs> = z.object({
  select: ReturnSelectSchema.optional(),
  include: ReturnIncludeSchema.optional(),
  data: z.union([ ReturnUpdateInputSchema,ReturnUncheckedUpdateInputSchema ]),
  where: ReturnWhereUniqueInputSchema,
}).strict() ;

export const ReturnUpdateManyArgsSchema: z.ZodType<Prisma.ReturnUpdateManyArgs> = z.object({
  data: z.union([ ReturnUpdateManyMutationInputSchema,ReturnUncheckedUpdateManyInputSchema ]),
  where: ReturnWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ReturnUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.ReturnUpdateManyAndReturnArgs> = z.object({
  data: z.union([ ReturnUpdateManyMutationInputSchema,ReturnUncheckedUpdateManyInputSchema ]),
  where: ReturnWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ReturnDeleteManyArgsSchema: z.ZodType<Prisma.ReturnDeleteManyArgs> = z.object({
  where: ReturnWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ReviewCreateArgsSchema: z.ZodType<Prisma.ReviewCreateArgs> = z.object({
  select: ReviewSelectSchema.optional(),
  include: ReviewIncludeSchema.optional(),
  data: z.union([ ReviewCreateInputSchema,ReviewUncheckedCreateInputSchema ]),
}).strict() ;

export const ReviewUpsertArgsSchema: z.ZodType<Prisma.ReviewUpsertArgs> = z.object({
  select: ReviewSelectSchema.optional(),
  include: ReviewIncludeSchema.optional(),
  where: ReviewWhereUniqueInputSchema,
  create: z.union([ ReviewCreateInputSchema,ReviewUncheckedCreateInputSchema ]),
  update: z.union([ ReviewUpdateInputSchema,ReviewUncheckedUpdateInputSchema ]),
}).strict() ;

export const ReviewCreateManyArgsSchema: z.ZodType<Prisma.ReviewCreateManyArgs> = z.object({
  data: z.union([ ReviewCreateManyInputSchema,ReviewCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ReviewCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ReviewCreateManyAndReturnArgs> = z.object({
  data: z.union([ ReviewCreateManyInputSchema,ReviewCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ReviewDeleteArgsSchema: z.ZodType<Prisma.ReviewDeleteArgs> = z.object({
  select: ReviewSelectSchema.optional(),
  include: ReviewIncludeSchema.optional(),
  where: ReviewWhereUniqueInputSchema,
}).strict() ;

export const ReviewUpdateArgsSchema: z.ZodType<Prisma.ReviewUpdateArgs> = z.object({
  select: ReviewSelectSchema.optional(),
  include: ReviewIncludeSchema.optional(),
  data: z.union([ ReviewUpdateInputSchema,ReviewUncheckedUpdateInputSchema ]),
  where: ReviewWhereUniqueInputSchema,
}).strict() ;

export const ReviewUpdateManyArgsSchema: z.ZodType<Prisma.ReviewUpdateManyArgs> = z.object({
  data: z.union([ ReviewUpdateManyMutationInputSchema,ReviewUncheckedUpdateManyInputSchema ]),
  where: ReviewWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ReviewUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.ReviewUpdateManyAndReturnArgs> = z.object({
  data: z.union([ ReviewUpdateManyMutationInputSchema,ReviewUncheckedUpdateManyInputSchema ]),
  where: ReviewWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ReviewDeleteManyArgsSchema: z.ZodType<Prisma.ReviewDeleteManyArgs> = z.object({
  where: ReviewWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const searchCreateArgsSchema: z.ZodType<Prisma.searchCreateArgs> = z.object({
  select: searchSelectSchema.optional(),
  include: searchIncludeSchema.optional(),
  data: z.union([ searchCreateInputSchema,searchUncheckedCreateInputSchema ]),
}).strict() ;

export const searchUpsertArgsSchema: z.ZodType<Prisma.searchUpsertArgs> = z.object({
  select: searchSelectSchema.optional(),
  include: searchIncludeSchema.optional(),
  where: searchWhereUniqueInputSchema,
  create: z.union([ searchCreateInputSchema,searchUncheckedCreateInputSchema ]),
  update: z.union([ searchUpdateInputSchema,searchUncheckedUpdateInputSchema ]),
}).strict() ;

export const searchCreateManyArgsSchema: z.ZodType<Prisma.searchCreateManyArgs> = z.object({
  data: z.union([ searchCreateManyInputSchema,searchCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const searchCreateManyAndReturnArgsSchema: z.ZodType<Prisma.searchCreateManyAndReturnArgs> = z.object({
  data: z.union([ searchCreateManyInputSchema,searchCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const searchDeleteArgsSchema: z.ZodType<Prisma.searchDeleteArgs> = z.object({
  select: searchSelectSchema.optional(),
  include: searchIncludeSchema.optional(),
  where: searchWhereUniqueInputSchema,
}).strict() ;

export const searchUpdateArgsSchema: z.ZodType<Prisma.searchUpdateArgs> = z.object({
  select: searchSelectSchema.optional(),
  include: searchIncludeSchema.optional(),
  data: z.union([ searchUpdateInputSchema,searchUncheckedUpdateInputSchema ]),
  where: searchWhereUniqueInputSchema,
}).strict() ;

export const searchUpdateManyArgsSchema: z.ZodType<Prisma.searchUpdateManyArgs> = z.object({
  data: z.union([ searchUpdateManyMutationInputSchema,searchUncheckedUpdateManyInputSchema ]),
  where: searchWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const searchUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.searchUpdateManyAndReturnArgs> = z.object({
  data: z.union([ searchUpdateManyMutationInputSchema,searchUncheckedUpdateManyInputSchema ]),
  where: searchWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const searchDeleteManyArgsSchema: z.ZodType<Prisma.searchDeleteManyArgs> = z.object({
  where: searchWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
}).strict() ;

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
  create: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
}).strict() ;

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const UserUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.UserUpdateManyAndReturnArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;