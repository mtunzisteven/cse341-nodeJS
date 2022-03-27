
// more elegant way to handle all server errors

const serverError = (err, res) => {

    const status = err.statuscode || 500;
    const message = err.message;
  
    // redirect error page
    res.status(status).render('error', {
      path: '/error',
      pageTitle: 'error!',
      status: status,
      message: message
  
    });
    
  }

exports.serverError = serverError;