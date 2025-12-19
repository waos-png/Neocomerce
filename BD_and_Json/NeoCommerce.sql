CREATE DATABASE neocommerce;
USE neocommerce;

-- ====================================
--   TABLA: usuario
-- ====================================
CREATE TABLE usuario (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  document_number BIGINT NOT NULL,
  document_type ENUM('CC','TI','PAS') NOT NULL,
  username VARCHAR(100) NOT NULL,
  cellphone VARCHAR(50),
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  gender ENUM('M','F','OTRO') NULL,
  age INT,
  rol ENUM('CLIENTE','VENDEDOR','ADMIN') DEFAULT 'CLIENTE',
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_usuario_document UNIQUE (document_number),
  CONSTRAINT uq_usuario_email UNIQUE (email),
  INDEX idx_usuario_document (document_number),
  INDEX idx_usuario_email (email)
);

-- ====================================
--   TABLA: vendedor
-- ====================================
CREATE TABLE vendedor (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  usuario_id BIGINT NOT NULL UNIQUE,
  nombre_tienda VARCHAR(255) NULL,  -- permitir null
  nit_o_rfc VARCHAR(50),
  telefono VARCHAR(50),
  direccion VARCHAR(255),
  ciudad VARCHAR(100),
  pais VARCHAR(100),
  verificado BOOLEAN DEFAULT FALSE,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_vendedor_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE,
  INDEX idx_vendedor_usuario (usuario_id)
);

-- ====================================
--   TABLA: product_category
-- ====================================
CREATE TABLE product_category (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(100),
  classification VARCHAR(100)
);

-- ====================================
--   TABLA: product
-- ====================================
CREATE TABLE product (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL,
  image_url TEXT,
  rating DECIMAL(3,2),
  stock INT DEFAULT 0,
  seller_id BIGINT NULL,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_product_seller FOREIGN KEY (seller_id) REFERENCES vendedor(id) ON DELETE SET NULL,
  INDEX idx_product_name (product_name)
);

-- ====================================
--   TABLA: product_category_map (N:N)
-- ====================================
CREATE TABLE product_category_map (
  product_id BIGINT,
  category_id BIGINT,
  PRIMARY KEY (product_id, category_id),
  CONSTRAINT fk_pcm_product FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE,
  CONSTRAINT fk_pcm_category FOREIGN KEY (category_id) REFERENCES product_category(id) ON DELETE CASCADE
);

-- ====================================
--   TABLA: cart
-- ====================================
CREATE TABLE cart (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  usuario_id BIGINT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_cart_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE,
  INDEX idx_cart_usuario_active (usuario_id, is_active)
);

-- ====================================
--   TABLA: cart_item
-- ====================================
CREATE TABLE cart_item (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  cart_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  price_at_add DECIMAL(12,2) NOT NULL,
  CONSTRAINT fk_cart_item_cart FOREIGN KEY (cart_id) REFERENCES cart(id) ON DELETE CASCADE,
  CONSTRAINT fk_cart_item_product FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE RESTRICT,
  INDEX idx_cart_item_cart (cart_id)
);

-- ====================================
--   TABLA: pedido
-- ====================================
CREATE TABLE pedido (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  usuario_id BIGINT NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estado ENUM('PENDIENTE','PAGADO','ENVIADO','ENTREGADO','CANCELADO') DEFAULT 'PENDIENTE',
  total DECIMAL(12,2) NOT NULL,
  CONSTRAINT fk_pedido_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);

-- ====================================
--   TABLA: pedido_item
-- ====================================
CREATE TABLE pedido_item (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  pedido_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  CONSTRAINT fk_pedido_item_pedido FOREIGN KEY (pedido_id) REFERENCES pedido(id) ON DELETE CASCADE,
  CONSTRAINT fk_pedido_item_product FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE RESTRICT
);

-- ====================================
--   ADMIN PREDETERMINADO (SI QUIERES)
-- ====================================
INSERT INTO usuario (document_number, document_type, username, cellphone, email, password, gender, age, rol)
VALUES (999999, 'CC', 'admin', '+000', 'admin@neo.com', '$2a$10$u6EiN..passwordhasheado', 'M', 30, 'ADMIN');


select * from usuario;
select * from vendedor;
