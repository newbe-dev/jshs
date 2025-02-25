import { Link } from "react-router-dom";
import classes from "./ActivityPage.module.css";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ActivityGridItem from "../ActivityGridItem";
import SelectBox from "../UI/SelectBox";
import Modal from "../UI/Modal";
import ActivityTable from "../ActivityTable";
import React from "react";
import { BASE_URL } from "../../config";
import { PLACEOPTIONS } from "../../constants";

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
    name: "대기중",
    value: 0,
  },
  {
    name: "승인됨",
    value: 1,
  },
  {
    name: "반려됨",
    value: 2,
  },
];

function ActivityPage() {
  const [activities, setActivities] = useState([]);
  const [searchKey, setSearchKey] = useState(SEARCHOPTIONS[0].value);
  const [dateFilter, setDateFilter] = useState("");
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
        const url = `${BASE_URL}/api/activities/${currentId}`;
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

  const cleanedSearchInput = searchInput.trim().toLowerCase();
  const filteredActivities =
    cleanedSearchInput || filter !== undefined || dateFilter !== ""
      ? activities
          .filter(
            (activity) => filter === undefined || filter === activity.status
          )
          .filter(
            (activity) =>
              dateFilter === "" || dateFilter === activity.date.substr(0, 10)
          )
          .filter((activity) => {
            if (searchKey === "participants")
              return (
                activity.participants.includes(cleanedSearchInput) ||
                activity.representative.includes(cleanedSearchInput)
              );
            else if (searchKey === "place")
              return PLACEOPTIONS.find(
                (place) => place.value === activity.place
              )
                .name.toLowerCase()
                .includes(cleanedSearchInput);
            else return activity[searchKey].includes(cleanedSearchInput);
            // Example)
            // if (searchKey === "details")
            //   return activity.details.includes(searchInput);
            // else if (searchKey === "place") ...
          })
      : activities;
  const groupedActivities = Object.groupBy(
    filteredActivities,
    ({ date }) => date
  );

  let content = filteredActivities.length ? (
    Object.entries(groupedActivities)
      .reverse()
      .map(([key, value]) => {
        return (
          <React.Fragment key={key}>
            <p className={classes.dateText}>{key.substring(0, 10)}</p>
            {isViewGrid ? (
              <ul className={classes.ul}>
                {value.map((activity) => {
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
              <ActivityTable key={key} activities={value} />
            )}
          </React.Fragment>
        );
      })
  ) : (
    <p>탐활서가 존재하지 않습니다.</p>
  );

  return (
    <>
      <Modal open={isModalOpen} className={classes.rejectModal}>
        <div className={classes.modalWrapper}>
          <h3>반려하기</h3>
          <p>반려 사유가 탐활서 상단에 표시됩니다.</p>
          <input
            className={classes.rejectReasonInput}
            ref={reasonInput}
            placeholder="반려 사유를 입력해주세요"
          ></input>
          <footer className={classes.modalActions}>
            <button
              onClick={() => {
                setIsModalOpen(false);
                reasonInput.current.value = "";
              }}
            >
              취소
            </button>
            <button onClick={handleReject}>확인</button>
          </footer>
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
          <input
            className={classes.controlDateFilter}
            type="date"
            onChange={(e) => setDateFilter(e.target.value)}
          />
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
        {content}
      </main>
    </>
  );
}

export default ActivityPage;
