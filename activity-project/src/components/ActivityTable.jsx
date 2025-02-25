import classes from "./ActivityTable.module.css";

function ActivityTable({ activities }) {
  return (
    <table className={classes.table}>
      <thead>
        <tr>
          <th style={{ width: "80px" }}>활동 시간</th>
          <th style={{ width: "120px" }}>활동 장소</th>
          <th style={{ width: "120px" }}>활동 내용</th>
          <th style={{ width: "" }}>전체 학생</th>
          <th style={{ width: "80px" }}>지도 교사</th>
        </tr>
      </thead>
      <tbody>
        {activities.map((activity) => {
          const {
            id,
            // date,
            time,
            details,
            representative,
            participants,
            place,
            instructor,
            // created_at,
            status,
            // onApprove,
            // onReject,
            // reject_reason,
          } = activity;
          let style;
          if (status === 0) {
            style = classes.pending;
          } else if (status === 1) {
            style = classes.approved;
          } else if (status === 2) {
            style = classes.rejected;
          }
          return (
            <tr
              key={id}
              className={style}
              style={{
                tableLayout: "fixed",
                opacity: status === 2 ? "0.5" : "1",
              }}
            >
              <td>{time}</td>
              <td>{place}</td>
              <td>{details}</td>
              <td style={{ textAlign: "left", wordBreak: "break-all" }}>
                <b className={classes.bold}>{`${representative}(대표학생)`}</b>
                {`, ${participants}`}
              </td>
              <td>{instructor}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default ActivityTable;
