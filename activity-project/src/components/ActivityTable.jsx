import classes from "./ActivityTable.module.css";

function ActivityTable({ activities }) {
  return (
    <table className={classes.table}>
      <thead>
        <tr>
          {/* <th>활동날짜</th> */}
          <th>활동시간</th>
          <th>활동장소</th>
          <th>활동내용</th>
          <th>대표학생</th>
          <th>참가학생</th>
          <th>지도교사</th>
          <th>상태</th>
        </tr>
      </thead>
      <tbody>
        {activities?.map((activity) => {
          return (
            <tr key={activity.id} style={{ tableLayout: "fixed" }}>
              {/* <td>{activity.date.substring(0, 10)}</td> */}
              <td>{activity.time}</td>
              <td>{activity.place}</td>
              <td>{activity.details}</td>
              <td>{activity.representative}</td>
              <td>{activity.participants}</td>
              <td>{activity.instructor}</td>
              <td>{activity.status}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default ActivityTable;
