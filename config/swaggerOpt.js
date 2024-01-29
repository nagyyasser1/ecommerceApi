const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-Commerce",
      description: "API to manage your products , orders , auth , contacts.",
      version: "1.0.0",
      contact: {
        name: "Nagy Yasser",
        email: "nagyy8751@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local development server",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

module.exports = swaggerOptions;
