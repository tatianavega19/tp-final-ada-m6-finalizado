import winston from 'winston';

// Configuración básica para Winston
const logger = winston.createLogger({
  level: 'info',  // Nivel mínimo de los mensajes a registrar
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console(),  // Registrar en la consola
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),  // Registrar errores en un archivo
    new winston.transports.File({ filename: 'logs/combined.log' })  // Registrar todo en un archivo general
  ]
});

export default logger;
