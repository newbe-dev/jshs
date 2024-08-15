import { PLACEOPTIONS } from "../constants";
import classes from "./ActivityGridItem.module.css";

function elapsedText(dateString) {
  const seconds = 1;
  const minute = seconds * 60;
  const hour = minute * 60;
  const day = hour * 24;

  let today = new Date();
  let date = new Date(dateString);
  const elapsedTime = Math.trunc((today.getTime() - date.getTime()) / 1000);

  let elapsedText = "";
  if (elapsedTime < seconds) {
    elapsedText = "방금 전";
  } else if (elapsedTime < minute) {
    elapsedText = elapsedTime + "초 전";
  } else if (elapsedTime < hour) {
    elapsedText = Math.trunc(elapsedTime / minute) + "분 전";
  } else if (elapsedTime < day) {
    elapsedText = Math.trunc(elapsedTime / hour) + "시간 전";
  } else if (elapsedTime < day * 15) {
    elapsedText = Math.trunc(elapsedTime / day) + "일 전";
  } else {
    elapsedText = dateString;
  }

  return elapsedText;
}

function ActivityGridItem({
  id,
  date,
  time,
  details,
  representative,
  participants,
  place,
  instructor,
  created_at,
  status,
  onApprove,
  onReject,
  reject_reason,
}) {
  let statusText;
  let style;
  if (status === 0) {
    statusText = "(대기중)";
    style = classes.pending;
  }
  if (status === 1) {
    statusText = "(승인됨)";
    style = classes.approved;
  }
  if (status === 2) {
    statusText = `(반려됨) (반려사유: ${reject_reason})`;
    style = classes.rejected;
  }
  return (
    <li
      key={id}
      className={classes.gridItem}
      style={status === 2 ? { opacity: 0.5 } : undefined}
    >
      <div className={classes.top}>
        <span className={`${classes.elapsedText} ${style}`}>
          {`${elapsedText(created_at)}${statusText}`}
        </span>
        {status === 0 ? (
          <div className={classes.buttonGroup}>
            <button onClick={onApprove} className={classes.approveButton}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
              </svg>
            </button>
            <button onClick={onReject} className={classes.rejectButton}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
              </svg>
            </button>
          </div>
        ) : null}
      </div>

      <h1 className={classes.details}>{details}</h1>

      <table>
        <tbody>
          <tr>
            <th>활동시간</th>
            <td>
              <p>{time}</p>
            </td>
          </tr>
          <tr>
            <th>활동장소</th>
            <td>
              <p>{PLACEOPTIONS.find((item) => item.value === place).name}</p>
            </td>
          </tr>
          <tr>
            <th>참가학생</th>
            <td>
              <p>
                <b className={classes.bold}>{`${representative}(대표학생)`}</b>
                {`, ${participants}`}
              </p>
            </td>
          </tr>
          <tr>
            <th>지도교사</th>
            <td>
              <p>{instructor}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </li>
  );
}

export default ActivityGridItem;
