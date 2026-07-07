CREATE DATABASE IF NOT EXISTS tienda_gamer;
USE tienda_gamer;

CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL
);

INSERT INTO productos (nombre, descripcion, precio, stock) VALUES
('Teclado Mecanico RGB', 'Switches red, formato TKL y retroiluminacion RGB', 39990, 15),
('Mouse Gamer Pro', 'Sensor de alta precision y seis botones programables', 24990, 8),
('Audifonos Surround X7', 'Sonido envolvente, microfono y almohadillas acolchadas', 45990, 30),
('Mousepad XL Speed', 'Superficie extendida para teclado y mouse', 15990, 40),
('Silla Gamer Nitro', 'Respaldo reclinable y soporte lumbar ajustable', 129990, 20);
