const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

let useMySQL = false;
let pool = null;

// Read dotenv in case server.js hasn't loaded it yet
require('dotenv').config();

// Attempt to load mysql2
let mysql = null;
try {
  mysql = require('mysql2/promise');
} catch (e) {
  console.log('mysql2 package not found or failed to load. Falling back to JSON database.');
}

const dbJsonPath = path.join(__dirname, '..', 'data', 'db.json');

// Initialize JSON database with default seed data if it doesn't exist
function initJsonDb() {
  const dataDir = path.dirname(dbJsonPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(dbJsonPath)) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync('admin123', salt);

    const defaultDb = {
      users: [
        { id: 1, email: 'admin@akshargraphics.com', password: hashedPassword, role: 'admin', created_at: new Date().toISOString() }
      ],
      hero_slides: [
        {
          id: 1,
          title: "Printing Services",
          subtitle: "Flyer Design, Poster Design, Brochures, Banner Printing, Roll-Up Standees",
          image_url: "/assets/slide_printing.jpg",
          cta_text: "Get Quote",
          cta_link: "/contact",
          order: 1,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          title: "Branding & Creative Design",
          subtitle: "Logo Design, Letterheads, Business Stationery, Corporate Identity",
          image_url: "/assets/slide_branding.jpg",
          cta_text: "Explore Services",
          cta_link: "/services",
          order: 2,
          created_at: new Date().toISOString()
        },
        {
          id: 3,
          title: "Premium Wedding Printing",
          subtitle: "Wedding Cards, Personalized Invitations & Premium Stationery",
          image_url: "/assets/slide_wedding.jpg",
          cta_text: "Inquire Now",
          cta_link: "/contact",
          order: 3,
          created_at: new Date().toISOString()
        }
      ],
      services: [
        {
          id: 1,
          category: "Graphic Design",
          name: "Creative Logo Design",
          description: "Elevate your brand with custom logo designs crafted by our experienced branding artists. We create memorable corporate identities.",
          benefits: JSON.stringify(["Unique concepts tailored to your brand", "Vector source files provided", "Multiple revisions", "Brand guidelines included"]),
          image_url: "/assets/service_logo.jpg",
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          category: "Printing Solutions",
          name: "High-Quality Flyers & Banners",
          description: "Print marketing assets that demand attention. Crisp colors, premium cardstocks, and state-of-the-art offset printing.",
          benefits: JSON.stringify(["Vibrant high-resolution printing", "Various paper thickness options", "Express next-day delivery", "Bulk discounts available"]),
          image_url: "/assets/service_printing.jpg",
          created_at: new Date().toISOString()
        },
        {
          id: 3,
          category: "Wedding Printing",
          name: "Premium Wedding Cards",
          description: "Handcrafted, foil-stamped, and laser-cut wedding invitation designs that make a stunning first impression for your special day.",
          benefits: JSON.stringify(["Gold and metallic foil stamping", "Custom envelope matching", "Handcrafted textured paper", "Digital matching e-cards"]),
          image_url: "/assets/service_wedding.jpg",
          created_at: new Date().toISOString()
        }
      ],
      portfolio: [
        {
          id: 1,
          category: "Wedding Cards",
          title: "Royal Crimson Foil Card",
          description: "Exquisite wedding card with heavy gold embossing and crimson velvet finish.",
          image_url: "/assets/portfolio_wedding.jpg",
          is_international: 1,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          category: "Business Branding",
          title: "Premium Corporate Stationery",
          description: "Letterhead, envelope, and card designs for corporate clients.",
          image_url: "/assets/portfolio_branding.jpg",
          is_international: 0,
          created_at: new Date().toISOString()
        },
        {
          id: 3,
          category: "Brochures",
          title: "Trifold Real Estate Catalog",
          description: "High-gloss marketing trifold brochure highlighting luxury villas.",
          image_url: "/assets/portfolio_brochure.jpg",
          is_international: 0,
          created_at: new Date().toISOString()
        }
      ],
      testimonials: [
        {
          id: 1,
          client_name: "Rajesh Patel",
          review: "Akshar Graphics has been printing our business cards and banners for over 5 years. Their quality is top-notch and delivery is always on time!",
          image_url: "/assets/client1.jpg",
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          client_name: "Sneha Mehta",
          review: "We ordered our wedding cards from Chandreshbhai. Every card was beautifully crafted. Our guests loved them. Highly recommended!",
          image_url: "/assets/client2.jpg",
          created_at: new Date().toISOString()
        }
      ],
      inquiries: [],
      settings: [
        {
          id: 1,
          logo_url: "/assets/logo.png",
          company_name: "Akshar Graphics",
          email: "akshargraphics15@gmail.com",
          phone: "98981 91220",
          address: "11, Sahvas Apt., Chowki Sheri Naka, Timaliyawad Main Road, Nanpura, Surat - 395001",
          social_links: JSON.stringify({
            facebook: "https://facebook.com",
            instagram: "https://instagram.com",
            whatsapp: "https://wa.me/919898191220"
          }),
          seo_settings: JSON.stringify({
            metaTitle: "Akshar Graphics - Premium Printing & Branding Surat",
            metaDescription: "20+ Years of Trusted Printing & Creative Solutions in Surat, Gujarat. Wedding Cards, Branding, Banners & more.",
            keywords: "printing surat, graphics surat, wedding cards surat"
          }),
          created_at: new Date().toISOString()
        }
      ]
    };

    fs.writeFileSync(dbJsonPath, JSON.stringify(defaultDb, null, 2));
    console.log('Initialized fallback JSON database at:', dbJsonPath);
  }
}

// Read database from JSON file
function readJsonDb() {
  initJsonDb();
  return JSON.parse(fs.readFileSync(dbJsonPath, 'utf8'));
}

// Write database to JSON file
function writeJsonDb(data) {
  fs.writeFileSync(dbJsonPath, JSON.stringify(data, null, 2));
}

// Initialize MySQL pool if credentials exist
if (mysql && process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME) {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    useMySQL = true;
    console.log('MySQL Connection Pool configured successfully.');
  } catch (err) {
    console.warn('Failed to configure MySQL pool. Falling back to JSON database.', err.message);
    useMySQL = false;
  }
} else {
  console.log('MySQL configuration missing in environment. Using JSON database fallback.');
  initJsonDb();
}

// Unified query wrapper
async function query(sql, params = []) {
  if (useMySQL) {
    try {
      const [rows] = await pool.execute(sql, params);
      return rows;
    } catch (err) {
      console.error('MySQL query error, attempting JSON fallback', err.message);
      // Fallback if MySQL fails during runtime
    }
  }

  // Fallback JSON-file CRUD handler
  const dbData = readJsonDb();
  const sqlNormalized = sql.replace(/\s+/g, ' ').trim();
  
  // Table extraction
  let tableName = '';
  const fromMatch = sqlNormalized.match(/FROM\s+([`\w]+)/i);
  const intoMatch = sqlNormalized.match(/INSERT\s+INTO\s+([`\w]+)/i);
  const updateMatch = sqlNormalized.match(/UPDATE\s+([`\w]+)/i);
  const deleteMatch = sqlNormalized.match(/DELETE\s+FROM\s+([`\w]+)/i);

  if (fromMatch) tableName = fromMatch[1].replace(/[`]/g, '');
  else if (intoMatch) tableName = intoMatch[1].replace(/[`]/g, '');
  else if (updateMatch) tableName = updateMatch[1].replace(/[`]/g, '');
  else if (deleteMatch) tableName = deleteMatch[1].replace(/[`]/g, '');

  if (!tableName || !dbData[tableName]) {
    // If not matching target table, return empty or settings
    if (sqlNormalized.includes('settings')) tableName = 'settings';
    else return [];
  }

  const table = dbData[tableName];

  // 1. SELECT query
  if (sqlNormalized.startsWith('SELECT')) {
    let result = [...table];

    // SELECT * FROM users WHERE email = ?
    if (tableName === 'users' && sqlNormalized.includes('email = ?')) {
      return result.filter(u => u.email === params[0]);
    }

    // SELECT * FROM settings LIMIT 1
    if (tableName === 'settings') {
      return [result[0]];
    }

    // Sorting options
    if (sqlNormalized.includes('ORDER BY order ASC') || sqlNormalized.includes('ORDER BY `order` ASC')) {
      result.sort((a, b) => (a.order || 0) - (b.order || 0));
    } else if (sqlNormalized.includes('ORDER BY created_at DESC')) {
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return result;
  }

  // 2. INSERT query
  if (sqlNormalized.startsWith('INSERT')) {
    // Extract columns
    const colsMatch = sqlNormalized.match(/\(([^)]+)\)/);
    if (!colsMatch) return { insertId: 0 };
    const cols = colsMatch[1].split(',').map(c => c.trim().replace(/[`]/g, ''));
    
    const newRow = {
      id: table.length > 0 ? Math.max(...table.map(r => r.id)) + 1 : 1,
      created_at: new Date().toISOString()
    };

    cols.forEach((col, idx) => {
      newRow[col] = params[idx];
    });

    table.push(newRow);
    writeJsonDb(dbData);
    return { insertId: newRow.id };
  }

  // 3. UPDATE query
  if (sqlNormalized.startsWith('UPDATE')) {
    // Parse SET clause
    // UPDATE table SET col1 = ?, col2 = ? WHERE id = ?
    const whereIdMatch = sqlNormalized.match(/WHERE\s+id\s*=\s*\?/i);
    const whereIdVal = whereIdMatch ? params[params.length - 1] : null;

    if (tableName === 'settings') {
      // settings is updated by id = 1
      const settingsRow = table[0];
      const setPart = sqlNormalized.match(/SET\s+(.+?)\s+WHERE/i);
      if (setPart) {
        const cols = setPart[1].split(',').map(part => part.split('=')[0].trim().replace(/[`]/g, ''));
        cols.forEach((col, idx) => {
          settingsRow[col] = params[idx];
        });
        writeJsonDb(dbData);
        return { affectedRows: 1 };
      }
    }

    if (whereIdVal !== null) {
      const idx = table.findIndex(r => r.id == whereIdVal);
      if (idx !== -1) {
        const setPart = sqlNormalized.match(/SET\s+(.+?)\s+WHERE/i);
        if (setPart) {
          const cols = setPart[1].split(',').map(part => part.split('=')[0].trim().replace(/[`]/g, ''));
          cols.forEach((col, cIdx) => {
            table[idx][col] = params[cIdx];
          });
          writeJsonDb(dbData);
          return { affectedRows: 1 };
        }
      }
    }
    return { affectedRows: 0 };
  }

  // 4. DELETE query
  if (sqlNormalized.startsWith('DELETE')) {
    const whereIdMatch = sqlNormalized.match(/WHERE\s+id\s*=\s*\?/i);
    const whereIdVal = whereIdMatch ? params[0] : null;
    
    if (whereIdVal !== null) {
      const idx = table.findIndex(r => r.id == whereIdVal);
      if (idx !== -1) {
        table.splice(idx, 1);
        writeJsonDb(dbData);
        return { affectedRows: 1 };
      }
    }
    return { affectedRows: 0 };
  }

  return [];
}

module.exports = {
  query,
  useMySQL: () => useMySQL
};
