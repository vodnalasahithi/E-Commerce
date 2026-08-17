export const handleRouteError = (error, res) => {
    console.log("Registration error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
}