import { Link } from "react-router-dom";
import classes from "./ActivityPage.module.css";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ActivityGridItem from "../ActivityGridItem";
import SelectBox from "../UI/SelectBox";
import Modal from "../UI/Modal";
import ActivityTable from "../ActivityTable";
import { BASE_URL } from "../../config";

const SEARCHOPTIONS = [
  {
    name: "활동내용",
    value: "details",
  },
  {
    name: "활동장소",
    value: "place",
  },
  {
    name: "참가학생",
    value: "participants",
  },
  {
    name: "지도교사",
    value: "instructor",
  },
];

const FILTEROPTIONS = [
  {
    name: "전체",
    value: undefined,
  },
  {
    name: "승인됨",
    value: 1,
  },
  {
    name: "대기중",
    value: 0,
  },
  {
    name: "반려됨",
    value: 2,
  },
];

function ActivityPage() {
  const [activities, setActivities] = useState([]);
  const [searchKey, setSearchKey] = useState(SEARCHOPTIONS[0].value);
  const [filter, setFilter] = useState(undefined);
  const [isViewGrid, setIsViewGrid] = useState(true); // grid vs list
  const [searchInput, setSearchInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentId, setCurrentId] = useState(undefined);

  const reasonInput = useRef();

  useEffect(() => {
    async function fetchFn() {
      try {
        const url = `${BASE_URL}/api/activities`;
        const res = await axios.get(url);
        // console.log(res.data);
        setActivities(res.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchFn();
  }, []);

  function handleSelect(e) {
    setSearchKey(e.target.value);
    setSearchInput("");
  }

  function handleInput(e) {
    setSearchInput(e.target.value);
  }

  function handleApprove(id) {
    async function fetchFn() {
      try {
        const url = `${BASE_URL}/api/activities/${id}`;
        const res = await axios.patch(url, {
          status: 1,
        });
        console.log(res.data);
        setActivities((prevActivities) =>
          prevActivities.map((activity) => {
            return activity.id === id ? { ...res.data[0] } : activity;
          })
        );
      } catch (error) {
        console.log(error);
      }
    }

    fetchFn();
  }

  function handleReject() {
    setIsModalOpen(false);
    const reason = reasonInput.current.value;
    if (!reason.trim()) return;
    async function fetchFn() {
      try {
        const url = `http://localhost:3000/api/activities/${currentId}`;
        const res = await axios.patch(url, {
          status: 2,
          rejectReason: reasonInput.current.value,
        });
        console.log(res.data);

        setActivities((prevActivities) =>
          prevActivities.map((activity) => {
            return activity.id === currentId ? { ...res.data[0] } : activity;
          })
        );
      } catch (error) {
        console.log(error);
      }
    }

    fetchFn();
  }

  function handleClickReject(id) {
    setCurrentId(id);
    setIsModalOpen(true);
  }

  let placeholder;
  if (searchKey === "details") placeholder = "활동내용으로 검색...";
  else if (searchKey === "place") placeholder = "활동장소로 검색...";
  else if (searchKey === "participants") placeholder = "참가학생으로 검색...";
  else if (searchKey === "instructor") placeholder = "지도교사로 검색...";

  const filteredActivities =
    searchInput || filter !== undefined
      ? activities
          .filter(
            (activity) => filter === undefined || filter === activity.status
          )
          .filter((activity) => {
            return activity[searchKey].includes(searchInput);
            // if (searchKey === "details")
            //   return activity.details.includes(searchInput);
            // else if (searchKey === "place") ...
          })
      : activities;

  return (
    <>
      <Modal open={isModalOpen} className={classes.rejectModal}>
        <div>
          <p>정말 반려하시겠습니까?</p>
          <input
            ref={reasonInput}
            placeholder="반려 사유를 입력해주세요"
          ></input>
          <div className={classes.buttonGroup}>
            <button onClick={() => setIsModalOpen(false)}>취소</button>
            <button onClick={handleReject}>확인</button>
          </div>
        </div>
      </Modal>
      <header className={classes.header}>
        <p>내비게이션</p>
      </header>
      <main className={classes.main}>
        <div className={classes.intro}>
          <h2>탐활서 확인</h2>
          <p>
            탐활서 발급 및 확인 페이지입니다.{" "}
            <Link to="apply">탐활서 신청하러 가기</Link>
          </p>
        </div>

        <div className={classes.utilityBar}>
          <div className={classes.searchGroup}>
            <SelectBox
              className={classes.controlSearchKey}
              name="place"
              options={SEARCHOPTIONS}
              onChange={handleSelect}
            />
            {/* <span className={classes.searchIcon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
              </svg>
            </span> */}
            <input
              type="search"
              className={classes.searchInput}
              placeholder={placeholder}
              onChange={handleInput}
              value={searchInput}
            />
          </div>
          <div className={classes.controlFilter}>
            {FILTEROPTIONS.map((option) => {
              return (
                <label key={option.name}>
                  <input
                    type="radio"
                    name="filter"
                    value={option.value}
                    checked={filter === option.value}
                    onChange={() => setFilter(option.value)}
                  />
                  {option.name}
                </label>
              );
            })}
          </div>
          <div className={classes.controlView}>
            <button
              onClick={() => setIsViewGrid(true)}
              style={isViewGrid ? { backgroundColor: "#f5f5f4" } : undefined}
            >
              <svg
                fill="none"
                height="24"
                shapeRendering="geometricPrecision"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                width="24"
                style={{ width: "16px", height: "16px" }}
              >
                <path d="M3 3h7v7H3z"></path>
                <path d="M14 3h7v7h-7z"></path>
                <path d="M14 14h7v7h-7z"></path>
                <path d="M3 14h7v7H3z"></path>
              </svg>
            </button>
            <button
              onClick={() => setIsViewGrid(false)}
              style={!isViewGrid ? { backgroundColor: "#f5f5f4" } : undefined}
            >
              <svg
                fill="none"
                height="24"
                shapeRendering="geometricPrecision"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                width="24"
                style={{ width: "16px", height: "16px" }}
              >
                <path d="M8 6h13"></path>
                <path d="M8 12h13"></path>
                <path d="M8 18h13"></path>
                <path d="M3 6h.01"></path>
                <path d="M3 12h.01"></path>
                <path d="M3 18h.01"></path>
              </svg>
            </button>
          </div>
        </div>

        {filteredActivities.length ? (
          isViewGrid ? (
            <ul className={classes.ul}>
              {filteredActivities?.map((activity) => {
                return (
                  <ActivityGridItem
                    key={activity.id}
                    {...activity}
                    onApprove={() => handleApprove(activity.id)}
                    onReject={() => handleClickReject(activity.id)}
                  />
                );
              })}
            </ul>
          ) : (
            <ActivityTable activities={filteredActivities} />
          )
        ) : (
          <p>탐활서가 존재하지 않습니다.</p>
        )}
      </main>
    </>
  );
}

export default ActivityPage;
