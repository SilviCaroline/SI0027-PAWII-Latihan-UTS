// TODO B: Controller Menu - CRUD lengkap (Pertemuan 3-4, 9-12)
//
// Format error: lempar objek { status, message } (lihat middlewares/errorHandler.js),
// mis. throw { status: 404, message: "Menu tidak ditemukan" }
// express-async-errors sudah aktif di app.js, jadi tidak perlu try/catch.

const Menu = require("../models/menuModel");

const MAX_LIMIT = 100;

// GET /menu
// Query opsional:
//   kantinId  filter berdasarkan kantin
//   sort        nama field, urut ascending (default: createdAt)
//   page        default 1
//   limit       default 10, maksimum 100
//   fields      projection, dipisah koma, mis. fields=nama,kode
// Respons 200: { data, page, limit, total }
//   - total = jumlah dokumen yang cocok dengan filter (BUKAN jumlah data pada halaman ini)
//   - data memuat kantinId yang ter-populate (objek Kantin)
exports.getAll = async (req, res) => {
  // TODO B1
  const {
    kantinId,
    sort = "createdAt",
    fields,
  } = req.query;

  const page = Math.max(
    1,
    parseInt(req.query.page, 10) || 1
  );

  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseInt(req.query.limit, 10) || 10)
  );

  const filter = {};

  if (kantinId) {
    filter.kantinId = kantinId;
  }

  let query = Menu.find(filter)
    .sort({ [sort]: 1 })
    .skip((page - 1) * limit)
    .limit(limit);

  if (fields) {
    const selectedFields = fields
      .split(",")
      .map((field) => field.trim())
      .filter(Boolean);

    if (selectedFields.length > 0) {
      query = query.select(selectedFields.join(" "));
    }

    if (
      selectedFields.length === 0 ||
      selectedFields.includes("kantinId")
    ) {
      query = query.populate("kantinId");
    }
  } else {
    query = query.populate("kantinId");
  }

  const [data, total] = await Promise.all([
    query,
    Menu.countDocuments(filter),
  ]);

  res.status(200).json({
    data,
    page,
    limit,
    total,
  });
};

// GET /menu/:id
//   - 200 -> dokumen menu, kantinId ter-populate
//   - tidak ada -> 404 { message }
//   - format id salah -> 400 (ditangani errorHandler lewat CastError)
exports.getById = async (req, res) => {
  // TODO B2
  const menu = await Menu.findById(req.params.id)
    .populate("kantinId");

  if (!menu) {
    throw {
      status: 404,
      message: "Menu tidak ditemukan",
    };
  }

  res.status(200).json(menu);
};

// POST /menu
//   - 201 -> dokumen yang baru dibuat
//   - validasi gagal / ISBN duplikat -> 400 (ditangani errorHandler)
exports.create = async (req, res) => {
  // TODO B3
  const menu = await Menu.create(req.body);

  res.status(201).json(menu);
};

// PUT /menu/:id
//   - 200 -> dokumen setelah diperbarui (bukan sebelum)
//   - validasi schema HARUS tetap berjalan saat update
//   - tidak ada -> 404 { message }
exports.update = async (req, res) => {
  // TODO B4
  const menu = await Menu.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!menu) {
    throw {
      status: 404,
      message: "Menu tidak ditemukan",
    };
  }

  res.status(200).json(menu);
};

// DELETE /menu/:id
//   - 204 tanpa body
//   - tidak ada -> 404 { message }
exports.remove = async (req, res) => {
  // TODO B5
  const menu = await Menu.findByIdAndDelete(
    req.params.id
  );

  if (!menu) {
    throw {
      status: 404,
      message: "Menu tidak ditemukan",
    };
  }

  res.status(204).send();
};
