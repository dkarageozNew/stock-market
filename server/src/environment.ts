export const environment = {
    REDIS_URL: process.env.REDIS_URL || 'redis://127.0.0.1:6379/4',
    NODE_ENV: process.env.NODE_ENV || 'development',
    CLIENT_PORT: process.env.CLIENT_PORT || 4200,
    API_TOKEN: 'ecf64affe413ade4f104ba24f522f63ceb9c8257',
    STOCK_API_URL: 'https://api.tiingo.com/tiingo/crypto/prices',
    PORT: 8080
};
