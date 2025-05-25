import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; 
import adminroutes from './routes/adminRoutes.js';
import clientroutes from './routes/clientRoutes.js';
import queryroutes from './routes/queryRoutes.js';

const app = express();
dotenv.config();

app.use(express.json());
app.use(cookieParser()); 

const allowedOrigins = [
    "http://localhost:5173",
    "https://jkrmain-nb1j.vercel.app",
    "http://localhost:8080",
];

const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            console.error(`CORS blocked request from origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, 
};

app.use(cors(corsOptions));

// ✅ Routes
app.use('/api/v1/adminroutes', adminroutes);
app.use('/api/v1/clientroutes', clientroutes);
app.use('/api/v1/queryroutes', queryroutes);

// Optional: for deployment
// app.use(express.static(path.join(__dirname, "/frontend/dist")));
// app.get('*', (_, res) => {
//     res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server Listening at port ${PORT}`);
});
