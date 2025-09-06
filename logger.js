// Custom logging middleware
module.exports = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const logEntry = {
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
            timestamp: new Date().toISOString()
        };
        // Here you could write to a file or external service
        // For demo, we use process.stdout
        process.stdout.write(JSON.stringify(logEntry) + '\n');
    });
    next();
};
