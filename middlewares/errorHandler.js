
// TODO D: Middleware error handling terpusat (Pertemuan 5 & 11-12)
// Didaftarkan PALING AKHIR pada app.js. Respons error SELALU berbentuk { message }.
//
// Pemetaan error -> status:
//   err.status ada (mis. { status: 404, message })  -> pakai status & message tersebut
//   ValidationError (Mongoose)                        -> 400, message dari error
//   CastError (format id/ObjectId salah)              -> 400, "Format <err.path> tidak valid"
//   Duplicate key (err.code === 11000)                -> 400, "Data dengan nilai unik tersebut sudah ada"
//   error lain yang tidak terduga                     -> 500, catat ke console.error,
//                                                        message ke client TETAP generik
//                                                        ("Terjadi kesalahan pada server"),
//                                                        stack trace jangan dibocorkan

function errorHandler(err, req, res, next) {
  // TODO D1

  // Error dengan status yang sudah ditentukan
  if (err.status) {
    return res.status(err.status).json({
      message: err.message,
    });
  }

  // Error validasi Mongoose
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: err.message,
    });
  }

  // Error format ObjectId tidak valid
  if (err.name === "CastError") {
    return res.status(400).json({
      message: `Format ${err.path} tidak valid`,
    });
  }

  // Error duplikasi data unik
  if (err.code === 11000) {
    return res.status(400).json({
      message: "Data dengan nilai unik tersebut sudah ada",
    });
  }

  // Error lain yang tidak terduga
  console.error(err);

  return res.status(500).json({
    message: "Terjadi kesalahan pada server",
  });
}

module.exports = errorHandler;
