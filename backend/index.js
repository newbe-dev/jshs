const express = require("express");
const mysql = require("mysql2");
const dbconfig = require("./config/database.js");
const db = mysql.createPool(dbconfig);
const cors = require("cors");
const path = require("path");
const { body, validationResult } = require("express-validator");
//
const app = express();
app.use(cors());
app.use(express.json());

// configuration =========================
app.set("port", process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, "/dist")));

/**
 * @returns 100 activities order by id desc
 */
app.get("/api/activities", (req, res) => {
  try {
    db.query(
      "SELECT * from Activity ORDER BY id DESC LIMIT 100;",
      (error, rows) => {
        if (error) throw error;
        res.send(rows);
        console.log(rows);
      }
    );
  } catch (error) {
    res.send(error);
  }
});

/**
 * @param date 활동일자
 * @param time 활동시간
 * @param details 활동내용
 * @param participants 참여학생
 * @param place 활동장소
 * @param representative 대표학생
 * @param instructor 지도교사
 * @returns 추가된 activity
 */

app.post(
  "/api/activities",
  [
    body("date").notEmpty().isDate(),
    body("time").notEmpty().isString(),
    body("details").notEmpty().isString(),
    body("representative").notEmpty().isString(),
    body("participants").notEmpty().isString(),
    body("place").notEmpty().isNumeric(),
    body("instructor").notEmpty().isString(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        date,
        time,
        details,
        representative,
        participants,
        place,
        instructor,
      } = req.body;
      const sql = `INSERT INTO Activity(id, date, time, details, representative, participants, place, instructor)
        VALUES(NULL, '${date}', '${time}', '${details}', '${representative}', '${participants}', '${place}', '${instructor}');`;
      db.query(sql, (error, rows) => {
        if (error) throw error;
        res.send(rows);
        console.log(rows);
      });
    } catch (error) {
      res.send(error);
    }
  }
);

/**
 * @param status 상태
 * @param reject_reason 반려사유
 * @returns 수정된 activity
 */
app.patch(
  "/api/activities/:id",
  [
    body("status").notEmpty().isNumeric(),
    // body("reject_reason").notEmpty().isString(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const id = req.params.id;
      const { status, rejectReason: reject_reason } = req.body;
      const sql = `UPDATE Activity SET status=${status}, reject_reason='${reject_reason}' WHERE id=${id};`;
      db.query(sql, (error, rows) => {
        if (error) throw error;
      });

      const sql2 = `SELECT * FROM Activity WHERE id=${id};`;
      db.query(sql2, (error, rows) => {
        if (error) throw error;
        res.send(rows);
      });
    } catch (error) {
      res.send(error);
    }
  }
);

// app.delete("/api/activities/:id", (req, res) => {
//   try {
//     const id = req.params.id;
//     const sql = `UPDATE Activity SET status=2 WHERE id=${id};`;
//     connection.query(sql, (error, rows) => {
//       if (error) throw error;
//       res.send(rows);
//       console.log(rows);
//     });
//   } catch (error) {
//     res.send(error);
//   }
// });

app.listen(app.get("port"), () => {
  console.log("Express server listening on port " + app.get("port"));
});

//
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "/dist/index.html"));
});
