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
      // "SELECT * from Activity ORDER BY id DESC LIMIT 100;",
      `SELECT 
      a.*,
      GROUP_CONCAT(DISTINCT atime.name ORDER BY atime.id SEPARATOR ', ') AS time,
      GROUP_CONCAT(DISTINCT u.name ORDER BY u.student_id SEPARATOR ', ') AS participants
      FROM activity a
      LEFT JOIN activity_schedule asch ON a.id = asch.activity_id
      LEFT JOIN time atime ON asch.id = atime.id
      LEFT JOIN activity_user au ON a.id = au.activity_id
      LEFT JOIN jshsus_user u ON au.student_id = u.student_id
      GROUP BY a.id
      ORDER BY a.id DESC
      LIMIT 100;`,
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
      const { date, time, details, participants, place, instructor } = req.body;
      const addActivityQuery = `INSERT INTO Activity(id, date, details, representative, place, instructor)
        VALUES(NULL, '${date}', '${details}', '${leader_student_id}', '${place}', '${instructor}');`;
      db.query(addActivityQuery, (error, rows) => {
        if (error) throw error;
        res.send(rows);
        console.log(rows);

        const activityId = rows.insertId;
        console.log(time);
        const timeId = time
          .split(",")
          .map((val, index) => (val == "true" ? index + 1 : null))
          .filter((val) => val);
        console.log(timeId);
        if (timeId.length === 0) return;

        // 4. activity_schedule 테이블에 해당 시간 추가
        const addActivityScheduleQuery = `
          INSERT INTO activity_schedule (activity_id, time_id)
          SELECT (?), t.id
          FROM time t
          WHERE t.id IN (?);
        `;
        db.query(
          addActivityScheduleQuery,
          [activityId, timeId],
          (error, results) => {
            if (error) console.log(error);
          }
        );

        const studentNumberArray = participants
          .split(",") // 쉼표(,) 기준으로 나누기
          .map((num) => num.trim()) // 각 요소의 공백 제거
          .filter((num) => num !== "") // 빈 값 제거
          .map(Number); // 숫자로 변환
        const findUsersQuery = `SELECT student_id FROM jshsus_user WHERE school_number IN (?)`;
        db.query(findUsersQuery, [studentNumberArray], (err, userResults) => {
          if (err) {
            console.log(err);
            return;
          }

          // 4. 가져온 user_id 목록을 activity_user 테이블에 삽입
          if (userResults.length === 0) {
            console.log("No matching users found.");
            return;
          }

          const values = userResults.map((user) => [
            activityId,
            user.student_id,
          ]);

          const insertActivityUserQuery =
            "INSERT INTO activity_user (activity_id, student_id) VALUES ?";

          db.query(insertActivityUserQuery, [values], (err, insertResults) => {
            if (err) {
              console.log(err);
            }
          });
        });
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
