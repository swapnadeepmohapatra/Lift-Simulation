function LiftSimulator(el) {
  let floors;
  let state;
  let liftCallsQueue = [];

  function start(_floors, _lifts) {
    floors = _floors;
    state = {
      lifts: new Array(_lifts).fill(0).map((_, i) => ({
        isBusy: false,
        floor: 0,
        index: i,
        direction: "up",
        highestDest: undefined,
        destinations: [],
      })),
    };

    removeEventListeners(el);
    renderElemenets(el, state);
    addEventListeners(el);
  }

  function renderElemenets(el, state) {
    const createdLifts = state.lifts
      .map((_, index) => {
        return `<div class="lift" id="lift${index}" data-current="${0}" style="margin-top: ${
          (floors - 1) * 116
        }px; margin-left: ${
          (index + 1) * 100
        }px"/><div class="door1"></div><div class="door2"></div></div>`;
      })
      .join("");

    const createdFloors = new Array(floors)
      .fill(0)
      .map((_, index) => {
        return `<div class="floor" id="floor${index}" ><div class="btn-div">
		  ${
        index !== floors - 1
          ? `<button id="up" data-floor="${index}">Up</button>`
          : "null"
      }
		  ${
        index !== 0
          ? `<button id="down" data-floor="${index}">Down</button>`
          : "null"
      }
		  </div><p>Floor ${index}</p></div>`;
      })
      .reverse()
      .join("");
    const html = `<div class="lift-simulator">${createdLifts}${createdFloors}</div>`;
    el.innerHTML = html;
  }

  function addEventListeners(el) {
    el.addEventListener("click", buttonClickEvent, true);
  }

  function removeEventListeners(el) {
    el.removeEventListener("click", buttonClickEvent, true);
  }

  const buttonClickEvent = (e) => {
    if (e.target.id === "up") {
      callLift(e.target.dataset.floor, "up");
    }

    if (e.target.id === "down") {
      callLift(e.target.dataset.floor, "down");
    }
  };

  function callLift(floor, direction) {
    if (checkIfLeftPresent(floor, direction).length > 0) {
      if (!checkIfLeftPresent(floor, direction)[0].isBusy)
        openLift(
          document.getElementById(
            `lift${checkIfLeftPresent(floor, direction)[0].index}`
          )
        );
      return;
    }
    const closestLift = getClosestEmptyLift(floor, direction);
    moveLift(closestLift, state.lifts[closestLift].floor, floor);
  }

  function checkIfLeftPresent(floor, direction) {
    const s = state.lifts.filter(
      (lift) => lift.floor === Number(floor) && lift.direction === direction
    );
    console.log(s);
    return s;
  }

  function moveLift(lift_no, currentFloor, newFloor) {
    if (state.lifts[lift_no].isBusy === true) return;

    const lift = document.getElementById(`lift${lift_no}`);
    lift.style.transform = `translateY(${-116 * newFloor}px)`;
    lift.style.transition = `transform ${
      2000 * Math.abs(newFloor - currentFloor)
    }ms ease-in-out`;

    if (newFloor > currentFloor) {
      lift.classList.add("lift-up");
      state.lifts[lift_no].direction = "up";
    } else if (newFloor < currentFloor) {
      lift.classList.add("lift-down");
      state.lifts[lift_no].direction = "down";
    }

    state.lifts[lift_no].floor = Number(newFloor);
    state.lifts[lift_no].isBusy = true;

    setTimeout(() => {
      openLift(lift);
    }, 2000 * Math.abs(newFloor - currentFloor));

    setTimeout(() => {
      state.lifts[lift_no].isBusy = false;
    }, 2000 * Math.abs(newFloor - currentFloor) + 5001);
  }

  function getClosestEmptyLift(destFloor) {
    const emptyLifts = state.lifts.reduce(
      (result, value) =>
        result.concat(
          value.isBusy === false
            ? {
                ...value,
                distance: Math.abs(destFloor - value.floor),
              }
            : []
        ),
      []
    );

    if (emptyLifts.length <= 0) {
      liftCallsQueue.push(destFloor);
      return null;
    }

    const closestLift = emptyLifts.reduce((result, value) =>
      value.distance < result.distance ? value : result
    );

    return closestLift.index;
  }

  function openLift(lift) {
    const door1 = lift.childNodes[1];
    const door2 = lift.childNodes[0];

    stopsMovingOfLifts(lift);
    opensBothTheDoors(door1, door2);

    setTimeout(() => {
      closesBothTheDoors(door1, door2);
    }, 2500);

    setTimeout(() => {
      stopsClosingBothTheDoors(door1, door2);
      checkForQueue();
    }, 5000);
  }

  function stopsClosingBothTheDoors(door1, door2) {
    door1.classList.remove("close");
    door2.classList.remove("close");
  }

  function closesBothTheDoors(door1, door2) {
    door1.classList.remove("open");
    door1.classList.add("close");
    door2.classList.remove("open");
    door2.classList.add("close");
  }

  function opensBothTheDoors(door1, door2) {
    door1.classList.add("open");
    door2.classList.add("open");
  }

  function stopsMovingOfLifts(lift) {
    lift.classList.remove("lift-up");
    lift.classList.remove("lift-down");
  }

  function checkForQueue() {
    if (liftCallsQueue.length > 0) {
      const floor = liftCallsQueue.sort().shift();
      callLift(floor);
    }
  }

  return {
    start,
  };
}

const liftsim = LiftSimulator(document.getElementById("app"));
// document.querySelector("button").addEventListener("click", () => {
//   liftsim.start(
//     Number(document.getElementById("floors").value),
//     Number(document.getElementById("lifts").value)
//   );
// });
liftsim.start(5, 2);
