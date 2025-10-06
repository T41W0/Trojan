-- Tegas Food Database Schema
CREATE DATABASE IF NOT EXISTS tegas_food;
USE tegas_food;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('user', 'admin') DEFAULT 'user',
  default_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  address VARCHAR(500) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  image_url VARCHAR(500),
  rating DECIMAL(3, 2) DEFAULT 0.0,
  delivery_fee_per_km DECIMAL(10, 2) DEFAULT 2.00,
  preparation_time INT DEFAULT 15, -- minutes
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Menu categories
CREATE TABLE IF NOT EXISTS categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  restaurant_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- Menu items
CREATE TABLE IF NOT EXISTS menu_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  restaurant_id INT NOT NULL,
  category_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(500),
  is_available BOOLEAN DEFAULT true,
  preparation_time INT DEFAULT 10, -- minutes
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  default_address TEXT,
  default_latitude DECIMAL(10, 8),
  default_longitude DECIMAL(11, 8),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  restaurant_id INT NOT NULL,
  order_number VARCHAR(20) UNIQUE NOT NULL,
  status ENUM('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled') DEFAULT 'pending',
  subtotal DECIMAL(10, 2) NOT NULL,
  delivery_fee DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  delivery_address TEXT NOT NULL,
  delivery_latitude DECIMAL(10, 8) NOT NULL,
  delivery_longitude DECIMAL(11, 8) NOT NULL,
  distance_km DECIMAL(8, 2) NOT NULL,
  estimated_delivery_time TIMESTAMP,
  payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  payment_intent_id VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  menu_item_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  special_instructions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO users (name, email, password_hash, phone, role, default_address) VALUES
('Admin User', 'admin@tegasfood.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1-555-0001', 'admin', NULL),
('John Doe', 'user@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1-555-0002', 'user', '123 Main St, City, State'),
('Jane Smith', 'jane@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1-555-0003', 'user', '456 Oak Ave, City, State'),
('Mike Johnson', 'mike@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1-555-0004', 'user', '789 Pine St, City, State'),
('Sarah Wilson', 'sarah@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1-555-0005', 'user', '321 Elm St, City, State');

INSERT INTO restaurants (name, description, address, latitude, longitude, phone, email, image_url, rating, delivery_fee_per_km, preparation_time) VALUES
('Tega\'s Pizza Palace', 'Authentic Italian pizzas with fresh ingredients', '123 Main St, Downtown', 40.7128, -74.0060, '+1-555-0123', 'info@tegas.com', '/images/restaurants/pizza-palace.jpg', 4.8, 2.50, 20),
('Burger Barn', 'Gourmet burgers and crispy fries', '456 Oak Ave, Midtown', 40.7589, -73.9851, '+1-555-0456', 'contact@burgerbarn.com', '/images/restaurants/burger-barn.jpg', 4.5, 2.00, 15),
('Sushi Zen', 'Fresh sushi and Japanese cuisine', '789 Pine St, Uptown', 40.7505, -73.9934, '+1-555-0789', 'hello@sushizen.com', '/images/restaurants/sushi-zen.jpg', 4.9, 3.00, 25);

INSERT INTO categories (restaurant_id, name, description, display_order) VALUES
(1, 'Pizzas', 'Authentic Italian pizzas', 1),
(1, 'Appetizers', 'Starters and sides', 2),
(1, 'Beverages', 'Drinks and refreshments', 3),
(2, 'Burgers', 'Gourmet burgers', 1),
(2, 'Sides', 'Fries and sides', 2),
(2, 'Beverages', 'Drinks', 3),
(3, 'Sushi Rolls', 'Traditional and specialty rolls', 1),
(3, 'Sashimi', 'Fresh raw fish', 2),
(3, 'Appetizers', 'Japanese appetizers', 3);

-- Add more restaurants for variety
INSERT INTO restaurants (name, description, address, latitude, longitude, phone, email, image_url, rating, delivery_fee_per_km, preparation_time) VALUES
('Italian Bistro', 'Authentic Italian cuisine with fresh pasta and sauces', '321 Pasta Lane, Little Italy', 40.7589, -73.9851, '+1-555-0124', 'info@italianbistro.com', '/images/restaurants/italian-bistro.jpg', 4.7, 2.25, 18),
('Asian Fusion', 'Modern Asian dishes with traditional flavors', '654 Rice Street, Chinatown', 40.7505, -73.9934, '+1-555-0125', 'hello@asianfusion.com', '/images/restaurants/asian-fusion.jpg', 4.6, 2.75, 20),
('Mexican Cantina', 'Spicy Mexican food and fresh margaritas', '987 Taco Boulevard, Mission District', 40.7128, -74.0060, '+1-555-0126', 'hola@mexicancantina.com', '/images/restaurants/mexican-cantina.jpg', 4.4, 2.50, 16),
('Seafood Shack', 'Fresh seafood and ocean-inspired dishes', '147 Ocean Drive, Harbor District', 40.7589, -73.9851, '+1-555-0127', 'catch@seafoodshack.com', '/images/restaurants/seafood-shack.jpg', 4.8, 3.00, 22),
('Dessert Paradise', 'Sweet treats and artisanal desserts', '258 Sugar Street, Sweet Valley', 40.7505, -73.9934, '+1-555-0128', 'sweet@dessertparadise.com', '/images/restaurants/dessert-paradise.jpg', 4.9, 2.00, 12);

-- Add more categories for new restaurants
INSERT INTO categories (restaurant_id, name, description, display_order) VALUES
-- Italian Bistro categories
(4, 'Pasta', 'Fresh handmade pasta dishes', 1),
(4, 'Appetizers', 'Italian appetizers and antipasti', 2),
(4, 'Desserts', 'Classic Italian desserts', 3),
(4, 'Beverages', 'Italian drinks and wines', 4),
-- Asian Fusion categories
(5, 'Sushi & Rolls', 'Fresh sushi and specialty rolls', 1),
(5, 'Stir-Fry', 'Wok-tossed dishes with fresh vegetables', 2),
(5, 'Noodles', 'Ramen and noodle bowls', 3),
(5, 'Appetizers', 'Asian appetizers and dim sum', 4),
-- Mexican Cantina categories
(6, 'Tacos', 'Authentic Mexican tacos', 1),
(6, 'Burritos', 'Loaded burritos and bowls', 2),
(6, 'Appetizers', 'Mexican appetizers and sides', 3),
(6, 'Beverages', 'Mexican drinks and margaritas', 4),
-- Seafood Shack categories
(7, 'Fresh Fish', 'Daily catch and grilled fish', 1),
(7, 'Shellfish', 'Lobster, crab, and shrimp dishes', 2),
(7, 'Soups', 'Seafood chowders and bisques', 3),
(7, 'Appetizers', 'Seafood appetizers and small plates', 4),
-- Dessert Paradise categories
(8, 'Cakes', 'Artisanal cakes and cheesecakes', 1),
(8, 'Pies', 'Fresh baked pies and tarts', 2),
(8, 'Ice Cream', 'Premium ice cream and sundaes', 3),
(8, 'Cookies', 'Fresh baked cookies and treats', 4);

-- Add 50 popular food items across all restaurants
INSERT INTO menu_items (restaurant_id, category_id, name, description, price, image_url, preparation_time) VALUES
-- Tega's Pizza Palace - Existing items + new ones
(1, 1, 'Margherita Pizza', 'Classic tomato, mozzarella, and basil', 18.99, '/images/menu/margherita.jpg', 15),
(1, 1, 'Pepperoni Pizza', 'Tomato sauce, mozzarella, and pepperoni', 21.99, '/images/menu/pepperoni.jpg', 15),
(1, 1, 'Cheese Pizza', 'Classic pizza topped with tomato sauce and mozzarella cheese', 16.99, '/images/menu/cheese-pizza.jpg', 15),
(1, 1, 'Flatbread Pizza', 'Thin crust pizza with various toppings', 19.99, '/images/menu/flatbread-pizza.jpg', 12),
(1, 1, 'Mini Pizzas', 'Individual-sized pizzas with customizable toppings', 12.99, '/images/menu/mini-pizza.jpg', 10),
(1, 2, 'Garlic Bread', 'Crispy bread with garlic butter', 8.99, '/images/menu/garlic-bread.jpg', 5),
(1, 2, 'Mozzarella Sticks', 'Crispy on the outside with gooey cheese inside, served with marinara sauce', 9.99, '/images/menu/mozzarella-sticks.jpg', 6),
(1, 2, 'Bruschetta', 'Toasted bread topped with a mixture of tomatoes, basil, and garlic', 8.49, '/images/menu/bruschetta.jpg', 4),
(1, 3, 'Coca Cola', 'Classic cola drink', 2.99, '/images/menu/coke.jpg', 1),
(1, 3, 'Sparkling Water', 'Refreshing sparkling water', 2.49, '/images/menu/sparkling-water.jpg', 1),

-- Burger Barn - Existing items + new ones
(2, 4, 'Classic Burger', 'Beef patty, lettuce, tomato, onion', 14.99, '/images/menu/classic-burger.jpg', 12),
(2, 4, 'Cheeseburger', 'Beef patty with melted cheese', 16.99, '/images/menu/cheese-burger.jpg', 12),
(2, 4, 'Fried Chicken Sandwich', 'Crispy fried chicken breast served on a bun with pickles and mayo', 15.99, '/images/menu/chicken-sandwich.jpg', 14),
(2, 4, 'Grilled Cheese Sandwich', 'Melted cheese between slices of toasted bread', 11.99, '/images/menu/grilled-cheese.jpg', 8),
(2, 4, 'Mini Burgers (Sliders)', 'Small-sized burgers, perfect for sharing', 12.99, '/images/menu/sliders.jpg', 10),
(2, 5, 'French Fries', 'Crispy golden fries', 6.99, '/images/menu/fries.jpg', 8),
(2, 5, 'Chicken Fingers/Nuggets', 'Breaded and fried chicken pieces, a favorite among all ages', 10.99, '/images/menu/chicken-nuggets.jpg', 12),
(2, 5, 'Fried Pickles', 'Tangy pickle slices battered and fried, served with ranch dressing', 7.99, '/images/menu/fried-pickles.jpg', 6),
(2, 6, 'Milkshake', 'Vanilla milkshake', 5.99, '/images/menu/milkshake.jpg', 5),
(2, 6, 'Root Beer Float', 'Creamy root beer with vanilla ice cream', 6.49, '/images/menu/root-beer-float.jpg', 3),

-- Sushi Zen - Existing items + new ones
(3, 7, 'California Roll', 'Crab, avocado, cucumber', 12.99, '/images/menu/california-roll.jpg', 10),
(3, 7, 'Spicy Tuna Roll', 'Fresh tuna with spicy mayo', 14.99, '/images/menu/spicy-tuna.jpg', 10),
(3, 7, 'Sushi Platter', 'Assortment of sushi rolls and nigiri', 28.99, '/images/menu/sushi-platter.jpg', 15),
(3, 7, 'Ramen', 'Japanese noodle soup with broth, noodles, and various toppings', 16.99, '/images/menu/ramen.jpg', 18),
(3, 8, 'Salmon Sashimi', 'Fresh salmon slices', 18.99, '/images/menu/salmon-sashimi.jpg', 5),
(3, 8, 'Pad Thai', 'Stir-fried rice noodles with shrimp, tofu, peanuts, and bean sprouts', 15.99, '/images/menu/pad-thai.jpg', 16),
(3, 9, 'Edamame', 'Steamed soybeans with salt', 6.99, '/images/menu/edamame.jpg', 3),
(3, 9, 'Crab Rangoon', 'Creamy crab filling wrapped in wonton wrappers and fried to perfection', 8.99, '/images/menu/crab-rangoon.jpg', 8),
(3, 9, 'Chicken Lettuce Wraps', 'Savory ground chicken mixed with vegetables, served with crisp lettuce leaves', 11.99, '/images/menu/lettuce-wraps.jpg', 12),

-- Italian Bistro
(4, 10, 'Pasta Carbonara', 'Pasta tossed with eggs, cheese, pancetta, and pepper', 19.99, '/images/menu/carbonara.jpg', 18),
(4, 10, 'Shrimp Scampi', 'Shrimp sautéed in garlic butter sauce, served over pasta', 22.99, '/images/menu/shrimp-scampi.jpg', 20),
(4, 10, 'Eggplant Parmesan', 'Breaded and fried eggplant slices baked with marinara sauce and cheese', 18.99, '/images/menu/eggplant-parm.jpg', 22),
(4, 11, 'Stuffed Mushrooms', 'Mushroom caps filled with a savory mixture of cheeses and herbs', 10.99, '/images/menu/stuffed-mushrooms.jpg', 12),
(4, 11, 'Calamari', 'Lightly breaded and fried squid rings, served with marinara sauce', 13.99, '/images/menu/calamari.jpg', 10),
(4, 12, 'Cheesecake', 'Rich and creamy dessert with a graham cracker crust', 7.99, '/images/menu/cheesecake.jpg', 5),
(4, 12, 'Tiramisu', 'Italian dessert made with layers of coffee-soaked ladyfingers and mascarpone cream', 8.99, '/images/menu/tiramisu.jpg', 5),
(4, 13, 'Italian Soda', 'Refreshing soda with Italian syrups', 4.99, '/images/menu/italian-soda.jpg', 2),

-- Asian Fusion
(5, 14, 'Chicken Tikka Masala', 'Tender chicken pieces cooked in a spiced tomato-based sauce', 17.99, '/images/menu/chicken-tikka.jpg', 20),
(5, 15, 'Vegetable Stir-Fry', 'Assorted vegetables stir-fried with soy sauce and served over rice', 14.99, '/images/menu/vegetable-stir-fry.jpg', 15),
(5, 15, 'Beef Stir-Fry', 'Tender beef strips stir-fried with vegetables and savory sauce', 18.99, '/images/menu/beef-stir-fry.jpg', 16),
(5, 16, 'Chicken Ramen', 'Rich chicken broth with noodles, vegetables, and tender chicken', 15.99, '/images/menu/chicken-ramen.jpg', 18),
(5, 16, 'Vegetable Ramen', 'Vegetarian ramen with fresh vegetables and rich vegetable broth', 14.99, '/images/menu/vegetable-ramen.jpg', 16),
(5, 17, 'Spring Rolls', 'Fresh vegetables wrapped in rice paper with dipping sauce', 7.99, '/images/menu/spring-rolls.jpg', 8),
(5, 17, 'Dumplings', 'Steamed dumplings filled with pork and vegetables', 9.99, '/images/menu/dumplings.jpg', 10),
(5, 18, 'Green Tea', 'Traditional Japanese green tea', 2.99, '/images/menu/green-tea.jpg', 2),

-- Mexican Cantina
(6, 19, 'Beef Tacos', 'Seasoned ground beef served in soft or hard taco shells with toppings', 12.99, '/images/menu/beef-tacos.jpg', 12),
(6, 19, 'Fish Tacos', 'Fresh fish with cabbage slaw and special sauce', 14.99, '/images/menu/fish-tacos.jpg', 14),
(6, 19, 'Chicken Quesadilla', 'Grilled tortilla filled with chicken and melted cheese', 13.99, '/images/menu/chicken-quesadilla.jpg', 10),
(6, 20, 'Burrito Bowl', 'A deconstructed burrito served in a bowl with rice, beans, and toppings', 15.99, '/images/menu/burrito-bowl.jpg', 12),
(6, 20, 'Pulled Pork Burrito', 'Slow-cooked pork wrapped in a flour tortilla with rice and beans', 16.99, '/images/menu/pulled-pork-burrito.jpg', 14),
(6, 21, 'Nachos Supreme', 'Tortilla chips topped with cheese, jalapeños, and your choice of meat', 11.99, '/images/menu/nachos-supreme.jpg', 8),
(6, 21, 'Guacamole & Chips', 'Fresh avocado dip served with crispy tortilla chips', 8.99, '/images/menu/guacamole.jpg', 5),
(6, 22, 'Margarita', 'Classic Mexican cocktail with tequila and lime', 8.99, '/images/menu/margarita.jpg', 3),

-- Seafood Shack
(7, 23, 'Fish and Chips', 'Battered and fried fish served with fries', 16.99, '/images/menu/fish-chips.jpg', 18),
(7, 23, 'Grilled Salmon', 'Fresh Atlantic salmon grilled to perfection', 22.99, '/images/menu/grilled-salmon.jpg', 20),
(7, 24, 'Lobster Roll', 'Chunks of lobster meat mixed with mayo, served in a toasted bun', 28.99, '/images/menu/lobster-roll.jpg', 15),
(7, 24, 'Shrimp Cocktail', 'Fresh shrimp served with cocktail sauce', 14.99, '/images/menu/shrimp-cocktail.jpg', 8),
(7, 25, 'Clam Chowder', 'Creamy soup with clams, potatoes, and onions', 9.99, '/images/menu/clam-chowder.jpg', 10),
(7, 25, 'Tomato Soup', 'Smooth tomato-based soup, often paired with grilled cheese', 6.99, '/images/menu/tomato-soup.jpg', 8),
(7, 26, 'Coconut Shrimp', 'Battered shrimp with coconut flakes, served with sweet chili sauce', 16.99, '/images/menu/coconut-shrimp.jpg', 12),
(7, 26, 'Crab Cakes', 'Fresh crab meat formed into patties and pan-fried', 19.99, '/images/menu/crab-cakes.jpg', 15),

-- Dessert Paradise
(8, 27, 'Chocolate Cheesecake', 'Rich chocolate cheesecake with chocolate crust', 8.99, '/images/menu/chocolate-cheesecake.jpg', 5),
(8, 27, 'Strawberry Cheesecake', 'Classic cheesecake topped with fresh strawberries', 8.99, '/images/menu/strawberry-cheesecake.jpg', 5),
(8, 28, 'Apple Pie', 'Classic pie filled with spiced apples', 6.99, '/images/menu/apple-pie.jpg', 8),
(8, 28, 'Key Lime Pie', 'Tart and sweet pie made with key lime juice', 7.99, '/images/menu/key-lime-pie.jpg', 6),
(8, 29, 'Banana Split', 'Banana served with scoops of ice cream, topped with sauces and whipped cream', 9.99, '/images/menu/banana-split.jpg', 8),
(8, 29, 'Molten Lava Cake', 'Chocolate cake with a gooey, molten center', 8.99, '/images/menu/lava-cake.jpg', 12),
(8, 30, 'Chocolate Chip Cookies', 'Classic cookies loaded with chocolate chips', 4.99, '/images/menu/chocolate-chip-cookies.jpg', 10),
(8, 30, 'Cinnamon Rolls', 'Sweet rolls filled with cinnamon sugar and topped with icing', 5.99, '/images/menu/cinnamon-rolls.jpg', 15);
