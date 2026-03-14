  
exports.validateTestimonial = (data) => {
    if(!data.name || !data.message) {
        return "Name and message required";
    }
    return null;
}