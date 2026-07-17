import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

// Comprehensive products with extensive variety for each subcategory
const COMPREHENSIVE_PRODUCTS = {
  'mens-shirt': [
    { name: 'DeerFit Premium Oxford White Shirt', description: 'Premium oxford weave, perfect for formal occasions', price: 3500, stock: 40, sku: 'MEN-SHIRT-OXF-W-001', material: 'Oxford Cotton', sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['White'] },
    { name: 'DeerFit Casual Blue Check Shirt', description: 'Blue checkered pattern for casual wear', price: 2200, stock: 55, sku: 'MEN-SHIRT-CHK-B-002', material: 'Cotton', sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Blue', 'Light Blue'] },
    { name: 'DeerFit Formal Black Dress Shirt', description: 'Professional black formal shirt', price: 3200, stock: 35, sku: 'MEN-SHIRT-FRM-B-003', material: 'Cotton', sizes: ['S', 'M', 'L', 'XL'], colors: ['Black'] },
    { name: 'DeerFit Red Striped Business Shirt', description: 'Red stripes for business meetings', price: 2600, stock: 45, sku: 'MEN-SHIRT-STR-R-004', material: 'Cotton Blend', sizes: ['M', 'L', 'XL', 'XXL'], colors: ['Red', 'Maroon'] },
    { name: 'DeerFit Navy Solid Formal Shirt', description: 'Navy blue formal dress shirt', price: 3100, stock: 38, sku: 'MEN-SHIRT-SLD-N-005', material: 'Cotton', sizes: ['S', 'M', 'L', 'XL'], colors: ['Navy'] },
    { name: 'DeerFit Gray Striped Office Shirt', description: 'Gray striped office wear', price: 2400, stock: 50, sku: 'MEN-SHIRT-STR-G-006', material: 'Cotton', sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Gray', 'Light Gray'] },
    { name: 'DeerFit Cream Linen Casual Shirt', description: 'Light cream linen for summer', price: 2300, stock: 60, sku: 'MEN-SHIRT-LIN-C-007', material: 'Linen', sizes: ['M', 'L', 'XL', 'XXL'], colors: ['Cream', 'Beige'] },
    { name: 'DeerFit Burgundy Silk Formal Shirt', description: 'Luxurious burgundy silk shirt', price: 4200, stock: 25, sku: 'MEN-SHIRT-SLK-B-008', material: 'Silk', sizes: ['S', 'M', 'L', 'XL'], colors: ['Burgundy'] },
    { name: 'DeerFit Green Floral Casual Shirt', description: 'Green floral pattern casual wear', price: 2200, stock: 48, sku: 'MEN-SHIRT-FLR-G-009', material: 'Cotton', sizes: ['M', 'L', 'XL'], colors: ['Green', 'Light Green'] },
    { name: 'DeerFit Purple Formal Dress Shirt', description: 'Purple elegant formal shirt', price: 3300, stock: 32, sku: 'MEN-SHIRT-FRM-P-010', material: 'Cotton', sizes: ['S', 'M', 'L', 'XL'], colors: ['Purple'] },
  ],
  'mens-tshirt': [
    { name: 'DeerFit Basic Black Crew Neck T-Shirt', description: 'Classic black crew neck tee', price: 1000, stock: 150, sku: 'MEN-TSHIRT-CRW-B-001', material: 'Cotton', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], colors: ['Black'] },
    { name: 'DeerFit White V-Neck T-Shirt', description: 'Stylish white V-neck', price: 1100, stock: 140, sku: 'MEN-TSHIRT-VNK-W-002', material: 'Cotton', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], colors: ['White'] },
    { name: 'DeerFit Gray Henley T-Shirt', description: 'Comfortable henley style', price: 1300, stock: 120, sku: 'MEN-TSHIRT-HNL-G-003', material: 'Cotton', sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Gray', 'Charcoal'] },
    { name: 'DeerFit Navy Round Neck T-Shirt', description: 'Navy blue round neck shirt', price: 1050, stock: 135, sku: 'MEN-TSHIRT-RND-N-004', material: 'Cotton', sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Navy'] },
    { name: 'DeerFit Red Graphic Print T-Shirt', description: 'Red with graphic design', price: 1400, stock: 100, sku: 'MEN-TSHIRT-GRP-R-005', material: 'Cotton', sizes: ['M', 'L', 'XL', 'XXL'], colors: ['Red'] },
    { name: 'DeerFit Blue Polo Style T-Shirt', description: 'Polo style casual shirt', price: 1600, stock: 95, sku: 'MEN-TSHIRT-PLO-B-006', material: 'Pique Cotton', sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Blue', 'Navy'] },
    { name: 'DeerFit Green Oversized T-Shirt', description: 'Trendy oversized fit in green', price: 1350, stock: 110, sku: 'MEN-TSHIRT-OVR-G-007', material: 'Cotton', sizes: ['M', 'L', 'XL', 'XXL', 'XXXL'], colors: ['Green', 'Olive'] },
    { name: 'DeerFit Purple Long Sleeve T-Shirt', description: 'Purple with long sleeves', price: 1500, stock: 85, sku: 'MEN-TSHIRT-LNG-P-008', material: 'Cotton', sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Purple', 'Lavender'] },
    { name: 'DeerFit Orange Muscle Fit T-Shirt', description: 'Muscle fit orange shirt', price: 1200, stock: 115, sku: 'MEN-TSHIRT-MSL-O-009', material: 'Cotton', sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Orange'] },
    { name: 'DeerFit Brown Vintage T-Shirt', description: 'Vintage style brown tee', price: 1300, stock: 105, sku: 'MEN-TSHIRT-VNT-B-010', material: 'Cotton', sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Brown', 'Tan'] },
    { name: 'DeerFit Striped Cotton T-Shirt', description: 'Striped design casual shirt', price: 1250, stock: 125, sku: 'MEN-TSHIRT-STR-001', material: 'Cotton', sizes: ['M', 'L', 'XL', 'XXL'], colors: ['Black/White', 'Blue/White'] },
    { name: 'DeerFit Maroon Crew Neck Premium T-Shirt', description: 'Premium maroon crew neck', price: 1450, stock: 90, sku: 'MEN-TSHIRT-PRE-M-012', material: 'Combed Cotton', sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Maroon'] },
  ],
  'mens-jacket': [
    { name: 'DeerFit Classic Blue Denim Jacket', description: 'Timeless blue denim jacket', price: 5500, stock: 40, sku: 'MEN-JACKET-DEN-B-001', material: 'Denim', sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Light Blue', 'Dark Blue'] },
    { name: 'DeerFit Premium Black Leather Jacket', description: 'Premium genuine leather jacket', price: 9500, stock: 18, sku: 'MEN-JACKET-LTH-B-002', material: 'Genuine Leather', sizes: ['S', 'M', 'L', 'XL'], colors: ['Black'] },
    { name: 'DeerFit Trendy Bomber Jacket Black', description: 'Modern black bomber style', price: 5200, stock: 45, sku: 'MEN-JACKET-BMB-B-003', material: 'Nylon', sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Black'] },
    { name: 'DeerFit Olive Windbreaker Jacket', description: 'Lightweight olive windbreaker', price: 3800, stock: 55, sku: 'MEN-JACKET-WND-O-004', material: 'Polyester', sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Olive', 'Navy', 'Black'] },
    { name: 'DeerFit Navy Wool Blazer Jacket', description: 'Professional navy blazer', price: 7200, stock: 25, sku: 'MEN-JACKET-BZR-N-005', material: 'Wool', sizes: ['S', 'M', 'L', 'XL'], colors: ['Navy'] },
    { name: 'DeerFit Gray Wool Overcoat', description: 'Long gray wool overcoat', price: 8500, stock: 20, sku: 'MEN-JACKET-OVR-G-006', material: 'Wool', sizes: ['S', 'M', 'L', 'XL'], colors: ['Gray', 'Charcoal'] },
    { name: 'DeerFit Brown Suede Jacket', description: 'Soft brown suede jacket', price: 7800, stock: 22, sku: 'MEN-JACKET-SUD-BR-007', material: 'Suede', sizes: ['S', 'M', 'L', 'XL'], colors: ['Brown', 'Tan'] },
    { name: 'DeerFit Red Puffer Jacket', description: 'Warm red puffer jacket', price: 6500, stock: 35, sku: 'MEN-JACKET-PUF-R-008', material: 'Polyester', sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Red'] },
    { name: 'DeerFit Khaki Cargo Jacket', description: 'Casual khaki cargo style', price: 4200, stock: 50, sku: 'MEN-JACKET-CRG-K-009', material: 'Cotton', sizes: ['M', 'L', 'XL', 'XXL'], colors: ['Khaki', 'Olive'] },
    { name: 'DeerFit Maroon Sports Jacket', description: 'Sporty maroon jacket', price: 5800, stock: 38, sku: 'MEN-JACKET-SPT-M-010', material: 'Polyester', sizes: ['S', 'M', 'L', 'XL'], colors: ['Maroon', 'Burgundy'] },
  ],
  'mens-pants': [
    { name: 'DeerFit Khaki Slim Fit Chinos', description: 'Khaki slim fit chinos', price: 3400, stock: 65, sku: 'MEN-PANTS-KHK-S-001', material: 'Cotton', sizes: ['28', '30', '32', '34', '36', '38'], colors: ['Khaki'] },
    { name: 'DeerFit Navy Formal Trousers', description: 'Navy formal dress pants', price: 3600, stock: 55, sku: 'MEN-PANTS-NAV-F-002', material: 'Polyester Blend', sizes: ['28', '30', '32', '34', '36', '38'], colors: ['Navy'] },
    { name: 'DeerFit Black Classic Formal Pants', description: 'Classic black formal trousers', price: 3800, stock: 50, sku: 'MEN-PANTS-BLK-C-003', material: 'Polyester Blend', sizes: ['28', '30', '32', '34', '36', '38'], colors: ['Black'] },
    { name: 'DeerFit Gray Dress Pants', description: 'Elegant gray dress pants', price: 3500, stock: 48, sku: 'MEN-PANTS-GRY-D-004', material: 'Wool Blend', sizes: ['28', '30', '32', '34', '36'], colors: ['Gray', 'Charcoal'] },
    { name: 'DeerFit Beige Casual Chinos', description: 'Beige casual chino pants', price: 3200, stock: 60, sku: 'MEN-PANTS-BEG-C-005', material: 'Cotton', sizes: ['28', '30', '32', '34', '36', '38'], colors: ['Beige'] },
    { name: 'DeerFit Olive Tactical Pants', description: 'Olive tactical cargo pants', price: 3600, stock: 45, sku: 'MEN-PANTS-OLV-T-006', material: 'Cotton', sizes: ['28', '30', '32', '34', '36'], colors: ['Olive', 'Green'] },
    { name: 'DeerFit Brown Cordurory Pants', description: 'Brown corduroy casual pants', price: 3300, stock: 55, sku: 'MEN-PANTS-BRN-CR-007', material: 'Corduroy', sizes: ['28', '30', '32', '34', '36'], colors: ['Brown', 'Tan'] },
    { name: 'DeerFit Maroon Slim Fit Trousers', description: 'Maroon slim fit dress pants', price: 3700, stock: 42, sku: 'MEN-PANTS-MAR-SF-008', material: 'Cotton Blend', sizes: ['30', '32', '34', '36'], colors: ['Maroon'] },
  ],
  'mens-jeans': [
    { name: 'DeerFit Dark Wash Slim Fit Jeans', description: 'Dark wash slim fit denim', price: 4000, stock: 75, sku: 'MEN-JEANS-DRK-SM-001', material: 'Denim', sizes: ['28', '30', '32', '34', '36', '38'], colors: ['Dark Blue'] },
    { name: 'DeerFit Light Wash Skinny Jeans', description: 'Light wash trendy skinny', price: 3800, stock: 70, sku: 'MEN-JEANS-LGT-SKN-002', material: 'Denim', sizes: ['28', '30', '32', '34', '36'], colors: ['Light Blue'] },
    { name: 'DeerFit Black Ripped Distressed Jeans', description: 'Black distressed ripped style', price: 4400, stock: 55, sku: 'MEN-JEANS-BLK-RIP-003', material: 'Denim', sizes: ['28', '30', '32', '34', '36'], colors: ['Black'] },
    { name: 'DeerFit Medium Blue Straight Jeans', description: 'Classic medium blue straight fit', price: 3600, stock: 80, sku: 'MEN-JEANS-MED-STR-004', material: 'Denim', sizes: ['28', '30', '32', '34', '36', '38'], colors: ['Medium Blue'] },
    { name: 'DeerFit Black Skinny Stretch Jeans', description: 'Black stretch skinny jeans', price: 3900, stock: 65, sku: 'MEN-JEANS-BLK-STR-005', material: 'Denim', sizes: ['28', '30', '32', '34', '36'], colors: ['Black'] },
    { name: 'DeerFit Blue Jogger Jeans', description: 'Comfortable jogger style jeans', price: 3500, stock: 70, sku: 'MEN-JEANS-BLU-JOG-006', material: 'Denim', sizes: ['28', '30', '32', '34', '36'], colors: ['Blue'] },
    { name: 'DeerFit Navy Flared Jeans', description: 'Trendy navy flare jeans', price: 3900, stock: 60, sku: 'MEN-JEANS-NAV-FLR-007', material: 'Denim', sizes: ['28', '30', '32', '34', '36'], colors: ['Navy'] },
    { name: 'DeerFit Indigo Premium Jeans', description: 'Premium indigo denim jeans', price: 4500, stock: 50, sku: 'MEN-JEANS-IND-PRE-008', material: 'Premium Denim', sizes: ['28', '30', '32', '34', '36'], colors: ['Indigo'] },
    { name: 'DeerFit White Bleached Jeans', description: 'White bleached casual jeans', price: 4000, stock: 48, sku: 'MEN-JEANS-WHT-BLC-009', material: 'Denim', sizes: ['28', '30', '32', '34'], colors: ['White'] },
  ],
  'womens-blouse': [
    { name: 'DeerFit Elegant White Silk Blouse', description: 'Elegant white silk formal blouse', price: 4000, stock: 45, sku: 'WOM-BLOUSE-WHT-ELG-001', material: 'Silk', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['White'] },
    { name: 'DeerFit Cream Satin Formal Blouse', description: 'Luxury cream satin blouse', price: 4200, stock: 38, sku: 'WOM-BLOUSE-CRM-SAT-002', material: 'Satin', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Cream'] },
    { name: 'DeerFit Rose Pink Cotton Blouse', description: 'Soft rose pink cotton blouse', price: 3600, stock: 50, sku: 'WOM-BLOUSE-RSE-CTN-003', material: 'Cotton', sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Rose Pink'] },
    { name: 'DeerFit Navy Professional Blouse', description: 'Professional navy office blouse', price: 3400, stock: 55, sku: 'WOM-BLOUSE-NAV-PRO-004', material: 'Cotton', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], colors: ['Navy'] },
    { name: 'DeerFit Maroon Floral Blouse', description: 'Beautiful maroon floral pattern', price: 3700, stock: 48, sku: 'WOM-BLOUSE-MAR-FLR-005', material: 'Cotton', sizes: ['S', 'M', 'L', 'XL'], colors: ['Maroon', 'Red'] },
    { name: 'DeerFit Black Elegant Formal Blouse', description: 'Black elegant formal wear', price: 3800, stock: 42, sku: 'WOM-BLOUSE-BLK-FRM-006', material: 'Cotton', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Black'] },
    { name: 'DeerFit Purple Chiffon Blouse', description: 'Light purple chiffon blouse', price: 3500, stock: 52, sku: 'WOM-BLOUSE-PRP-CHF-007', material: 'Chiffon', sizes: ['S', 'M', 'L', 'XL'], colors: ['Purple', 'Lavender'] },
    { name: 'DeerFit Green Printed Cotton Blouse', description: 'Green printed casual blouse', price: 3200, stock: 58, sku: 'WOM-BLOUSE-GRN-PRT-008', material: 'Cotton', sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Green'] },
    { name: 'DeerFit Burgundy Silky Blouse', description: 'Burgundy silky formal blouse', price: 3900, stock: 40, sku: 'WOM-BLOUSE-BRG-SLK-009', material: 'Polyester Silk', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Burgundy'] },
  ],
  'womens-tshirt': [
    { name: 'DeerFit Classic Black Fitted T-Shirt', description: 'Classic black fitted tee', price: 1200, stock: 110, sku: 'WOM-TSHIRT-BLK-FIT-001', material: 'Cotton', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], colors: ['Black'] },
    { name: 'DeerFit White V-Neck T-Shirt', description: 'White V-neck fitted shirt', price: 1250, stock: 120, sku: 'WOM-TSHIRT-WHT-VNK-002', material: 'Cotton', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], colors: ['White'] },
    { name: 'DeerFit Pink Soft Cotton T-Shirt', description: 'Soft pink comfortable tee', price: 1300, stock: 100, sku: 'WOM-TSHIRT-PNK-SFT-003', material: 'Cotton', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Pink', 'Light Pink'] },
    { name: 'DeerFit Purple Casual T-Shirt', description: 'Purple casual fitted shirt', price: 1350, stock: 95, sku: 'WOM-TSHIRT-PRP-CAS-004', material: 'Cotton', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Purple', 'Lavender'] },
    { name: 'DeerFit Navy Blue T-Shirt', description: 'Navy blue comfortable tee', price: 1200, stock: 115, sku: 'WOM-TSHIRT-NAV-001', material: 'Cotton', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], colors: ['Navy'] },
    { name: 'DeerFit Gray Oversized T-Shirt', description: 'Gray trendy oversized fit', price: 1400, stock: 85, sku: 'WOM-TSHIRT-GRY-OVR-006', material: 'Cotton', sizes: ['S', 'M', 'L', 'XL'], colors: ['Gray', 'Charcoal'] },
    { name: 'DeerFit Red Long Sleeve T-Shirt', description: 'Red with long sleeves', price: 1500, stock: 80, sku: 'WOM-TSHIRT-RED-LNG-007', material: 'Cotton', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Red'] },
    { name: 'DeerFit Green Striped T-Shirt', description: 'Green striped casual shirt', price: 1350, stock: 92, sku: 'WOM-TSHIRT-GRN-STR-008', material: 'Cotton', sizes: ['S', 'M', 'L', 'XL'], colors: ['Green'] },
    { name: 'DeerFit Maroon Premium T-Shirt', description: 'Maroon premium cotton tee', price: 1600, stock: 75, sku: 'WOM-TSHIRT-MAR-PRE-009', material: 'Combed Cotton', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Maroon'] },
  ],
  'womens-jacket': [
    { name: 'DeerFit Classic Black Leather Jacket', description: 'Stylish black genuine leather', price: 8200, stock: 28, sku: 'WOM-JACKET-BLK-LTH-001', material: 'Genuine Leather', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Black'] },
    { name: 'DeerFit Blue Denim Jacket', description: 'Classic blue denim style', price: 5000, stock: 45, sku: 'WOM-JACKET-BLU-DEN-002', material: 'Denim', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Light Blue', 'Dark Blue'] },
    { name: 'DeerFit Professional Navy Blazer', description: 'Professional navy blazer', price: 5800, stock: 38, sku: 'WOM-JACKET-NAV-BLZ-003', material: 'Polyester', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Navy'] },
    { name: 'DeerFit Trendy Black Bomber Jacket', description: 'Trendy black bomber style', price: 4600, stock: 50, sku: 'WOM-JACKET-BLK-BMB-004', material: 'Nylon', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Black'] },
    { name: 'DeerFit Red Casual Jacket', description: 'Bright red casual jacket', price: 4800, stock: 42, sku: 'WOM-JACKET-RED-CAS-005', material: 'Cotton', sizes: ['S', 'M', 'L', 'XL'], colors: ['Red'] },
    { name: 'DeerFit Olive Windbreaker Jacket', description: 'Light olive windbreaker', price: 4200, stock: 55, sku: 'WOM-JACKET-OLV-WND-006', material: 'Polyester', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], colors: ['Olive', 'Navy'] },
    { name: 'DeerFit Burgundy Wool Jacket', description: 'Burgundy wool formal jacket', price: 6500, stock: 32, sku: 'WOM-JACKET-BRG-WOL-007', material: 'Wool', sizes: ['XS', 'S', 'M', 'L'], colors: ['Burgundy'] },
    { name: 'DeerFit White Casual Blazer', description: 'White casual linen blazer', price: 5200, stock: 40, sku: 'WOM-JACKET-WHT-BLZ-008', material: 'Linen', sizes: ['S', 'M', 'L', 'XL'], colors: ['White', 'Cream'] },
  ],
  'womens-pants': [
    { name: 'DeerFit Black Formal Trousers', description: 'Black formal professional pants', price: 3400, stock: 65, sku: 'WOM-PANTS-BLK-FRM-001', material: 'Cotton Polyester', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Black'] },
    { name: 'DeerFit Navy Office Pants', description: 'Navy office wear pants', price: 3300, stock: 60, sku: 'WOM-PANTS-NAV-OFC-002', material: 'Cotton', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Navy'] },
    { name: 'DeerFit Gray Elegant Trousers', description: 'Gray elegant dress pants', price: 3500, stock: 55, sku: 'WOM-PANTS-GRY-ELG-003', material: 'Polyester', sizes: ['S', 'M', 'L', 'XL'], colors: ['Gray', 'Charcoal'] },
    { name: 'DeerFit Khaki Casual Pants', description: 'Khaki casual everyday pants', price: 3100, stock: 70, sku: 'WOM-PANTS-KHK-CAS-004', material: 'Cotton', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Khaki'] },
    { name: 'DeerFit Maroon Slim Fit Pants', description: 'Maroon slim fit trousers', price: 3400, stock: 50, sku: 'WOM-PANTS-MAR-SLM-005', material: 'Cotton', sizes: ['S', 'M', 'L', 'XL'], colors: ['Maroon'] },
    { name: 'DeerFit Burgundy Formal Pants', description: 'Burgundy formal dress pants', price: 3600, stock: 45, sku: 'WOM-PANTS-BRG-FRM-006', material: 'Polyester', sizes: ['S', 'M', 'L', 'XL'], colors: ['Burgundy'] },
    { name: 'DeerFit Beige Chino Pants', description: 'Beige casual chino pants', price: 3000, stock: 65, sku: 'WOM-PANTS-BEG-CHN-007', material: 'Cotton', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Beige'] },
  ],
  'womens-jeans': [
    { name: 'DeerFit Dark Blue Slim Fit Jeans', description: 'Dark blue slim fit denim', price: 4000, stock: 70, sku: 'WOM-JEANS-DRK-SLM-001', material: 'Denim', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Dark Blue'] },
    { name: 'DeerFit Light Blue Skinny Jeans', description: 'Light blue trendy skinny', price: 3800, stock: 75, sku: 'WOM-JEANS-LGT-SKN-002', material: 'Denim', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Light Blue'] },
    { name: 'DeerFit Black Ripped Jeans', description: 'Black stylish ripped design', price: 4400, stock: 60, sku: 'WOM-JEANS-BLK-RIP-003', material: 'Denim', sizes: ['S', 'M', 'L', 'XL'], colors: ['Black'] },
    { name: 'DeerFit Medium Blue Straight Jeans', description: 'Medium blue straight fit', price: 3700, stock: 65, sku: 'WOM-JEANS-MED-STR-004', material: 'Denim', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Medium Blue'] },
    { name: 'DeerFit Navy Flare Jeans', description: 'Navy flare style jeans', price: 4200, stock: 55, sku: 'WOM-JEANS-NAV-FLR-005', material: 'Denim', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Navy'] },
    { name: 'DeerFit Black Bootcut Jeans', description: 'Classic black bootcut jeans', price: 3900, stock: 58, sku: 'WOM-JEANS-BLK-BCT-006', material: 'Denim', sizes: ['S', 'M', 'L', 'XL'], colors: ['Black'] },
    { name: 'DeerFit White Bleached Jeans', description: 'White bleached casual jeans', price: 4100, stock: 50, sku: 'WOM-JEANS-WHT-BLC-007', material: 'Denim', sizes: ['S', 'M', 'L', 'XL'], colors: ['White'] },
    { name: 'DeerFit Purple Stretch Jeans', description: 'Purple comfortable stretch jeans', price: 3950, stock: 52, sku: 'WOM-JEANS-PRP-STR-008', material: 'Denim', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Purple'] },
  ],
  'womens-skirt': [
    { name: 'DeerFit Black A-Line Skirt', description: 'Classic black A-line skirt', price: 2600, stock: 55, sku: 'WOM-SKIRT-BLK-ALN-001', material: 'Cotton', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Black'] },
    { name: 'DeerFit Navy Pencil Skirt', description: 'Professional navy pencil skirt', price: 2800, stock: 50, sku: 'WOM-SKIRT-NAV-PNC-002', material: 'Polyester', sizes: ['S', 'M', 'L', 'XL'], colors: ['Navy'] },
    { name: 'DeerFit Blue Midi Skirt', description: 'Elegant blue midi length', price: 2700, stock: 60, sku: 'WOM-SKIRT-BLU-MDI-003', material: 'Cotton', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Blue', 'Navy'] },
    { name: 'DeerFit White Pleated Skirt', description: 'Classic white pleated design', price: 2500, stock: 65, sku: 'WOM-SKIRT-WHT-PLE-004', material: 'Polyester', sizes: ['S', 'M', 'L', 'XL'], colors: ['White'] },
    { name: 'DeerFit Maroon Maxi Skirt', description: 'Maroon full length maxi skirt', price: 2900, stock: 48, sku: 'WOM-SKIRT-MAR-MXI-005', material: 'Cotton', sizes: ['S', 'M', 'L', 'XL'], colors: ['Maroon'] },
    { name: 'DeerFit Green Printed Skirt', description: 'Green floral printed skirt', price: 2600, stock: 52, sku: 'WOM-SKIRT-GRN-PRT-006', material: 'Cotton', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Green'] },
    { name: 'DeerFit Burgundy High-Waist Skirt', description: 'Burgundy high-waist skirt', price: 2750, stock: 45, sku: 'WOM-SKIRT-BRG-HGH-007', material: 'Cotton', sizes: ['S', 'M', 'L', 'XL'], colors: ['Burgundy'] },
  ],
  'womens-dress': [
    { name: 'DeerFit White Casual Day Dress', description: 'White casual everyday dress', price: 3600, stock: 55, sku: 'WOM-DRESS-WHT-CAS-001', material: 'Cotton', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['White'] },
    { name: 'DeerFit Blue Elegant Maxi Dress', description: 'Blue elegant maxi length', price: 4800, stock: 45, sku: 'WOM-DRESS-BLU-MXI-002', material: 'Cotton', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Blue', 'Navy'] },
    { name: 'DeerFit Black Party Evening Dress', description: 'Black glamorous evening dress', price: 5800, stock: 35, sku: 'WOM-DRESS-BLK-PRT-003', material: 'Satin', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Black'] },
    { name: 'DeerFit Red Cocktail Dress', description: 'Red stylish cocktail wear', price: 5200, stock: 40, sku: 'WOM-DRESS-RED-CCK-004', material: 'Polyester', sizes: ['S', 'M', 'L', 'XL'], colors: ['Red'] },
    { name: 'DeerFit Maroon Casual Sundress', description: 'Maroon casual summer dress', price: 3400, stock: 50, sku: 'WOM-DRESS-MAR-SND-005', material: 'Cotton', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Maroon'] },
    { name: 'DeerFit Pink Floral Print Dress', description: 'Pink with floral print', price: 3800, stock: 52, sku: 'WOM-DRESS-PNK-FLR-006', material: 'Cotton', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Pink'] },
    { name: 'DeerFit Green Summer Dress', description: 'Light green summer dress', price: 3500, stock: 58, sku: 'WOM-DRESS-GRN-SUM-007', material: 'Cotton', sizes: ['S', 'M', 'L', 'XL'], colors: ['Green'] },
    { name: 'DeerFit Gold Party Gown', description: 'Luxurious gold party gown', price: 7200, stock: 20, sku: 'WOM-DRESS-GLD-PWN-008', material: 'Silk', sizes: ['XS', 'S', 'M', 'L'], colors: ['Gold'] },
    { name: 'DeerFit Burgundy Formal Dress', description: 'Burgundy formal occasion dress', price: 5500, stock: 38, sku: 'WOM-DRESS-BRG-FRM-009', material: 'Polyester', sizes: ['S', 'M', 'L', 'XL'], colors: ['Burgundy'] },
  ],
  'womens-saree': [
    { name: 'DeerFit Cotton Daily Saree', description: 'Comfortable daily wear cotton', price: 3500, stock: 40, sku: 'WOM-SAREE-CTN-DAI-001', material: 'Cotton', sizes: ['One Size'], colors: ['Maroon', 'Blue', 'Green'] },
    { name: 'DeerFit Premium Silk Saree', description: 'Luxurious silk formal saree', price: 7000, stock: 22, sku: 'WOM-SAREE-SLK-PRM-002', material: 'Silk', sizes: ['One Size'], colors: ['Red', 'Green', 'Purple'] },
    { name: 'DeerFit Printed Cotton Saree', description: 'Beautiful printed design', price: 4200, stock: 35, sku: 'WOM-SAREE-CTN-PRT-003', material: 'Cotton', sizes: ['One Size'], colors: ['Blue', 'Pink', 'Multicolor'] },
    { name: 'DeerFit Light Linen Saree', description: 'Light linen for hot weather', price: 3000, stock: 45, sku: 'WOM-SAREE-LIN-LGT-004', material: 'Linen', sizes: ['One Size'], colors: ['Cream', 'Yellow'] },
    { name: 'DeerFit Embroidered Saree', description: 'Beautiful embroidered design', price: 5500, stock: 28, sku: 'WOM-SAREE-EMB-DES-005', material: 'Cotton Silk', sizes: ['One Size'], colors: ['Red', 'Gold', 'Blue'] },
    { name: 'DeerFit Festival Saree', description: 'Special festival occasion saree', price: 6000, stock: 25, sku: 'WOM-SAREE-FST-OCC-006', material: 'Silk Cotton', sizes: ['One Size'], colors: ['Maroon', 'Gold'] },
  ],
  'kids-boys': [
    { name: 'DeerFit Boys Navy T-Shirt', description: 'Navy blue boys tee', price: 950, stock: 110, sku: 'KID-TSHIRT-NAV-BOY-001', material: 'Cotton', sizes: ['4', '6', '8', '10', '12', '14'], colors: ['Navy'] },
    { name: 'DeerFit Boys White Polo Shirt', description: 'White casual polo shirt', price: 1400, stock: 85, sku: 'KID-TSHIRT-POL-WHT-002', material: 'Pique Cotton', sizes: ['6', '8', '10', '12', '14'], colors: ['White'] },
    { name: 'DeerFit Boys Graphic Tee', description: 'Fun graphic print tee', price: 1150, stock: 105, sku: 'KID-TSHIRT-GRP-BOY-003', material: 'Cotton', sizes: ['6', '8', '10', '12', '14'], colors: ['Black', 'Blue', 'Gray'] },
    { name: 'DeerFit Boys Blue Denim Jacket', description: 'Cool blue denim jacket', price: 2500, stock: 40, sku: 'KID-JACKET-DEN-BOY-004', material: 'Denim', sizes: ['6', '8', '10', '12'], colors: ['Blue'] },
    { name: 'DeerFit Boys Casual Shorts', description: 'Comfy casual shorts', price: 1200, stock: 90, sku: 'KID-SHORTS-CAS-BOY-005', material: 'Cotton', sizes: ['4', '6', '8', '10', '12'], colors: ['Blue', 'Khaki', 'Navy'] },
    { name: 'DeerFit Boys Denim Jeans', description: 'Durable boys denim jeans', price: 1800, stock: 75, sku: 'KID-JEANS-DEN-BOY-006', material: 'Denim', sizes: ['6', '8', '10', '12', '14'], colors: ['Blue', 'Black'] },
    { name: 'DeerFit Boys Red Sports T-Shirt', description: 'Red sporty tee', price: 1050, stock: 95, sku: 'KID-TSHIRT-SPT-RED-007', material: 'Cotton', sizes: ['6', '8', '10', '12'], colors: ['Red'] },
    { name: 'DeerFit Boys Cargo Pants', description: 'Practical cargo pants', price: 1700, stock: 70, sku: 'KID-PANTS-CRG-BOY-008', material: 'Cotton', sizes: ['6', '8', '10', '12'], colors: ['Khaki', 'Olive'] },
  ],
  'kids-girls': [
    { name: 'DeerFit Girls Pink T-Shirt', description: 'Pretty pink girls tee', price: 1050, stock: 105, sku: 'KID-TSHIRT-PNK-GRL-001', material: 'Cotton', sizes: ['4', '6', '8', '10', '12'], colors: ['Pink', 'Light Pink'] },
    { name: 'DeerFit Girls Purple Casual Dress', description: 'Purple casual everyday dress', price: 2300, stock: 50, sku: 'KID-DRESS-PRP-GRL-002', material: 'Cotton', sizes: ['4', '6', '8', '10', '12'], colors: ['Purple'] },
    { name: 'DeerFit Girls Printed T-Shirt', description: 'Trendy printed design', price: 1250, stock: 95, sku: 'KID-TSHIRT-PRT-GRL-003', material: 'Cotton', sizes: ['6', '8', '10', '12', '14'], colors: ['Blue', 'Multicolor'] },
    { name: 'DeerFit Girls Floral Dress', description: 'Adorable floral dress', price: 2500, stock: 45, sku: 'KID-DRESS-FLR-GRL-004', material: 'Cotton', sizes: ['4', '6', '8', '10', '12'], colors: ['Floral', 'Pink'] },
    { name: 'DeerFit Girls Casual Shorts', description: 'Cute play shorts', price: 1300, stock: 85, sku: 'KID-SHORTS-CAS-GRL-005', material: 'Cotton', sizes: ['4', '6', '8', '10', '12'], colors: ['Pink', 'Purple', 'Blue'] },
    { name: 'DeerFit Girls Denim Jeans', description: 'Comfortable girls jeans', price: 1900, stock: 65, sku: 'KID-JEANS-DEN-GRL-006', material: 'Denim', sizes: ['6', '8', '10', '12', '14'], colors: ['Blue', 'Purple'] },
    { name: 'DeerFit Girls White Polo Shirt', description: 'White school polo shirt', price: 1400, stock: 80, sku: 'KID-TSHIRT-POL-WHT-007', material: 'Pique Cotton', sizes: ['6', '8', '10', '12'], colors: ['White'] },
    { name: 'DeerFit Girls Party Dress', description: 'Special occasion party dress', price: 3200, stock: 30, sku: 'KID-DRESS-PRT-GRL-008', material: 'Polyester', sizes: ['6', '8', '10', '12'], colors: ['Pink', 'Gold'] },
  ],
  'headwear': [
    { name: 'DeerFit Classic Black Baseball Cap', description: 'Timeless black baseball cap', price: 800, stock: 140, sku: 'ACC-CAP-BLK-001', material: 'Cotton Canvas', sizes: ['One Size'], colors: ['Black'] },
    { name: 'DeerFit Navy Sports Cap', description: 'Navy sports casual cap', price: 850, stock: 125, sku: 'ACC-CAP-NAV-002', material: 'Cotton Canvas', sizes: ['One Size'], colors: ['Navy'] },
    { name: 'DeerFit White Golf Cap', description: 'White golf sports cap', price: 900, stock: 110, sku: 'ACC-CAP-WHT-003', material: 'Cotton Canvas', sizes: ['One Size'], colors: ['White'] },
    { name: 'DeerFit Red Casual Cap', description: 'Red casual baseball cap', price: 850, stock: 115, sku: 'ACC-CAP-RED-004', material: 'Cotton Canvas', sizes: ['One Size'], colors: ['Red'] },
    { name: 'DeerFit Wool Winter Beanie', description: 'Warm wool winter beanie', price: 1100, stock: 95, sku: 'ACC-BEANIE-WOL-001', material: 'Wool', sizes: ['One Size'], colors: ['Black', 'Navy', 'Gray', 'Maroon'] },
    { name: 'DeerFit Fleece Winter Hat', description: 'Comfortable fleece hat', price: 950, stock: 105, sku: 'ACC-HAT-FLC-002', material: 'Fleece', sizes: ['One Size'], colors: ['Black', 'Navy', 'Gray'] },
    { name: 'DeerFit Sports Athletic Cap', description: 'Sporty athletic cap', price: 900, stock: 120, sku: 'ACC-CAP-SPT-005', material: 'Polyester', sizes: ['One Size'], colors: ['Black', 'Blue', 'Red'] },
    { name: 'DeerFit Trendy Bucket Hat', description: 'Fashionable bucket style', price: 1100, stock: 85, sku: 'ACC-HAT-BCK-006', material: 'Cotton', sizes: ['One Size'], colors: ['Black', 'Khaki', 'Blue'] },
  ],
  'footwear': [
    { name: 'DeerFit White Canvas Sneakers', description: 'Classic white canvas shoes', price: 2800, stock: 90, sku: 'ACC-SHOES-CAN-WHT-001', material: 'Canvas', sizes: ['6', '7', '8', '9', '10', '11', '12'], colors: ['White'] },
    { name: 'DeerFit Black Canvas Sneakers', description: 'Black casual canvas shoes', price: 2800, stock: 85, sku: 'ACC-SHOES-CAN-BLK-002', material: 'Canvas', sizes: ['6', '7', '8', '9', '10', '11', '12'], colors: ['Black'] },
    { name: 'DeerFit Navy Canvas Sneakers', description: 'Navy canvas everyday shoes', price: 2800, stock: 80, sku: 'ACC-SHOES-CAN-NAV-003', material: 'Canvas', sizes: ['6', '7', '8', '9', '10', '11'], colors: ['Navy'] },
    { name: 'DeerFit Black Running Shoes', description: 'Comfortable running shoes', price: 5000, stock: 70, sku: 'ACC-SHOES-RUN-BLK-004', material: 'Mesh & Rubber', sizes: ['6', '7', '8', '9', '10', '11', '12'], colors: ['Black'] },
    { name: 'DeerFit Blue Running Shoes', description: 'Blue athletic running shoes', price: 5000, stock: 65, sku: 'ACC-SHOES-RUN-BLU-005', material: 'Mesh & Rubber', sizes: ['6', '7', '8', '9', '10', '11'], colors: ['Blue', 'Navy'] },
    { name: 'DeerFit Brown Leather Loafers', description: 'Stylish brown loafer shoes', price: 3600, stock: 55, sku: 'ACC-LOAFERS-BRN-006', material: 'Leather', sizes: ['6', '7', '8', '9', '10', '11'], colors: ['Brown'] },
    { name: 'DeerFit Black Formal Shoes', description: 'Professional black formal shoes', price: 4500, stock: 50, sku: 'ACC-SHOES-FRM-BLK-007', material: 'Leather', sizes: ['6', '7', '8', '9', '10', '11', '12'], colors: ['Black'] },
    { name: 'DeerFit Brown Formal Shoes', description: 'Brown elegant formal shoes', price: 4500, stock: 48, sku: 'ACC-SHOES-FRM-BRN-008', material: 'Leather', sizes: ['6', '7', '8', '9', '10', '11'], colors: ['Brown'] },
  ],
  'belts': [
    { name: 'DeerFit Black Genuine Leather Belt', description: 'Premium black leather belt', price: 1700, stock: 95, sku: 'ACC-BELT-LTH-BLK-001', material: 'Genuine Leather', sizes: ['28-30', '30-32', '32-34', '34-36', '36-38'], colors: ['Black'] },
    { name: 'DeerFit Brown Genuine Leather Belt', description: 'Brown leather quality belt', price: 1700, stock: 90, sku: 'ACC-BELT-LTH-BRN-002', material: 'Genuine Leather', sizes: ['28-30', '30-32', '32-34', '34-36', '36-38'], colors: ['Brown'] },
    { name: 'DeerFit Tan Leather Belt', description: 'Tan casual leather belt', price: 1600, stock: 85, sku: 'ACC-BELT-LTH-TAN-003', material: 'Genuine Leather', sizes: ['28-30', '30-32', '32-34', '34-36'], colors: ['Tan'] },
    { name: 'DeerFit Navy Canvas Belt', description: 'Navy casual canvas belt', price: 1200, stock: 115, sku: 'ACC-BELT-CAN-NAV-004', material: 'Canvas', sizes: ['28-30', '30-32', '32-34', '34-36', '36-38'], colors: ['Navy'] },
    { name: 'DeerFit Khaki Canvas Belt', description: 'Khaki casual canvas belt', price: 1200, stock: 110, sku: 'ACC-BELT-CAN-KHK-005', material: 'Canvas', sizes: ['28-30', '30-32', '32-34', '34-36', '36-38'], colors: ['Khaki'] },
    { name: 'DeerFit Black Formal Belt', description: 'Black formal occasion belt', price: 2000, stock: 80, sku: 'ACC-BELT-FRM-BLK-006', material: 'Genuine Leather', sizes: ['28-30', '30-32', '32-34', '34-36', '36-38'], colors: ['Black'] },
  ],
  'scarves': [
    { name: 'DeerFit Black Wool Winter Scarf', description: 'Classic black wool scarf', price: 1400, stock: 100, sku: 'ACC-SCARF-WOL-BLK-001', material: 'Wool', sizes: ['One Size'], colors: ['Black'] },
    { name: 'DeerFit Gray Wool Scarf', description: 'Warm gray wool scarf', price: 1400, stock: 95, sku: 'ACC-SCARF-WOL-GRY-002', material: 'Wool', sizes: ['One Size'], colors: ['Gray', 'Charcoal'] },
    { name: 'DeerFit Navy Wool Scarf', description: 'Navy blue wool winter scarf', price: 1400, stock: 90, sku: 'ACC-SCARF-WOL-NAV-003', material: 'Wool', sizes: ['One Size'], colors: ['Navy'] },
    { name: 'DeerFit Purple Silk Scarf', description: 'Luxurious purple silk scarf', price: 2000, stock: 70, sku: 'ACC-SCARF-SLK-PRP-004', material: 'Silk', sizes: ['One Size'], colors: ['Purple', 'Lavender'] },
    { name: 'DeerFit Pink Silk Scarf', description: 'Pink elegant silk scarf', price: 2000, stock: 75, sku: 'ACC-SCARF-SLK-PNK-005', material: 'Silk', sizes: ['One Size'], colors: ['Pink'] },
    { name: 'DeerFit Blue Silk Scarf', description: 'Blue luxurious silk scarf', price: 2000, stock: 70, sku: 'ACC-SCARF-SLK-BLU-006', material: 'Silk', sizes: ['One Size'], colors: ['Blue'] },
    { name: 'DeerFit Green Cotton Scarf', description: 'Light green cotton scarf', price: 1200, stock: 100, sku: 'ACC-SCARF-CTN-GRN-007', material: 'Cotton', sizes: ['One Size'], colors: ['Green'] },
    { name: 'DeerFit Cream Pashmina Shawl', description: 'Luxurious cream pashmina', price: 2800, stock: 45, sku: 'ACC-SHAWL-PAS-CRM-008', material: 'Pashmina', sizes: ['One Size'], colors: ['Cream'] },
    { name: 'DeerFit Red Pashmina Shawl', description: 'Red elegant pashmina wrap', price: 2800, stock: 50, sku: 'ACC-SHAWL-PAS-RED-009', material: 'Pashmina', sizes: ['One Size'], colors: ['Red'] },
  ],
};

async function generateComprehensiveProductReport() {
  try {
    console.log('\n╔═════════════════════════════════════════════════════╗');
    console.log('║   🛍️  COMPREHENSIVE PRODUCT CATALOG GENERATION    ║');
    console.log('╚═════════════════════════════════════════════════════╝\n');

    let totalProducts = 0;
    const categoryStats = {};

    // Display all products by category
    for (const [categoryKey, products] of Object.entries(COMPREHENSIVE_PRODUCTS)) {
      const categoryName = categoryKey.replace(/-/g, ' ').toUpperCase();
      console.log(`\n📁 ${categoryName}`);
      console.log(`   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

      let categoryPrice = 0;
      let categoryStock = 0;

      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        categoryPrice += product.price;
        categoryStock += product.stock;
        totalProducts++;

        const priceStr = `৳${product.price}`.padEnd(8);
        const stockStr = `${product.stock} units`.padEnd(12);
        const colors = product.colors.join('/').substring(0, 20);

        console.log(`   ${(i + 1).toString().padEnd(2)} ${product.name.substring(0, 35).padEnd(35)} ${priceStr} ${stockStr}`);
      }

      const avgPrice = Math.round(categoryPrice / products.length);
      categoryStats[categoryKey] = {
        count: products.length,
        avgPrice: avgPrice,
        totalStock: categoryStock,
        totalValue: categoryPrice
      };

      console.log(`   ─────────────────────────────────────────────────`);
      console.log(`   Subtotal: ${products.length} items | Avg Price: ৳${avgPrice} | Stock: ${categoryStock}`);
    }

    // Display comprehensive statistics
    console.log('\n\n╔═════════════════════════════════════════════════════╗');
    console.log('║   📊 COMPREHENSIVE STATISTICS                      ║');
    console.log('╚═════════════════════════════════════════════════════╝\n');

    // Summary by category
    console.log('📦 PRODUCTS BY CATEGORY:\n');
    let totalStock = 0;
    let totalValue = 0;

    for (const [category, stats] of Object.entries(categoryStats)) {
      const displayName = category.replace(/-/g, ' ').toUpperCase();
      console.log(`   ${displayName.padEnd(30)} ${stats.count.toString().padStart(2)} items | ৳${stats.totalValue} | ${stats.totalStock} units`);
      totalStock += stats.totalStock;
      totalValue += stats.totalValue;
    }

    // Overall statistics
    const avgPrice = Math.round(totalValue / totalProducts);
    const prices = Object.values(COMPREHENSIVE_PRODUCTS)
      .flat()
      .map(p => p.price)
      .sort((a, b) => a - b);
    const minPrice = prices[0];
    const maxPrice = prices[prices.length - 1];

    console.log(`\n╭─────────────────────────────────────────────────────╮`);
    console.log(`│ OVERALL STATISTICS                                  │`);
    console.log(`├─────────────────────────────────────────────────────┤`);
    console.log(`│  Total Products:         ${totalProducts.toString().padStart(35)} │`);
    console.log(`│  Total Inventory:        ${totalStock.toString().padStart(35)} units │`);
    console.log(`│  Total Catalog Value:    ৳${totalValue.toString().padStart(32)} │`);
    console.log(`│  Average Price:          ৳${avgPrice.toString().padStart(32)} │`);
    console.log(`│  Price Range:            ৳${minPrice} - ৳${maxPrice.toString().padStart(24)} │`);
    console.log(`│  Categories:             ${Object.keys(COMPREHENSIVE_PRODUCTS).length.toString().padStart(35)} │`);
    console.log(`╰─────────────────────────────────────────────────────╯`);

    console.log(`\n✅ Product generation complete!`);
    console.log(`📝 Total: ${totalProducts} comprehensive products ready for database import\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

generateComprehensiveProductReport();
