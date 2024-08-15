import classes from "./ActivityTable.module.css";

function ActivityTable({ activities }) {
  return (
    <table className={classes.table}>
      <thead>
        <tr>
          {/* <th>활동날짜</th> */}
          <th style={{ width: "80px" }}>활동 시간</th>
          <th style={{ width: "120px" }}>활동 장소</th>
          <th style={{ width: "120px" }}>활동 내용</th>
          {/* <th>대표학생</th> */}
          <th style={{ width: "" }}>전체 학생</th>
          <th style={{ width: "80px" }}>지도 교사</th>
        </tr>
      </thead>
      <tbody>
        {activities.map((activity) => {
          return (
            <tr key={activity.id} style={{ tableLayout: "fixed" }}>
              {/* <td>{activity.date.substring(0, 10)}</td> */}

              <td>{activity.time}</td>
              <td>{activity.place}</td>
              <td>{activity.details}</td>
              {/* <td>{activity.representative}</td> */}
              <td style={{ textAlign: "left", wordBreak: "break-all" }}>
                {activity.participants}
              </td>
              <td>{activity.instructor}</td>
              {/* <td>{activity.status}</td> */}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default ActivityTable;
