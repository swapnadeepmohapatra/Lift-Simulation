function LiftSimulator(el, floors, lifts) {
  const state = {
    lifts: new Array(lifts).fill(0).map((_, i) => ({
      busy: false,
      floor: 0,
      index: i,
    })),
  };

  renderElemenets(el, state);
  addEventListeners(el);

  function renderElemenets(el, state) {
    const createdLifts = state.lifts
      .map((_, index) => {
        return `<div class="lift" id="lift${index}" data-current="${0}" style="margin-top: ${
          (floors - 1) * 116
        }px; margin-left: ${(index + 1) * 100}px"/></div>`;
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
    el.addEventListener("click", (e) => {
      if (e.target.id === "up" || e.target.id === "down") {
        callLift(e.target.dataset.floor);
      }

      console.log(state);
    });
  }

  function callLift(floor) {
    moveLift(0, state.lifts[0].floor, floor);
  }

  function moveLift(lift_no, currentFloor, newFloor) {
    if (state.lifts[lift_no].busy === true) return;

    const lift = document.getElementById(`lift${lift_no}`);
    console.log(newFloor - currentFloor);
    lift.style.transform = `translateY(${-116 * newFloor}px)`;
    lift.style.transition = `transform ${
      2000 * Math.abs(newFloor - currentFloor)
    }ms ease-in-out`;

    state.lifts[lift_no].floor = Number(newFloor);
    state.lifts[lift_no].busy = true;

    setTimeout(() => {
      state.lifts[lift_no].busy = false;
    }, 2000 * Math.abs(newFloor - currentFloor));
  }
}

LiftSimulator(document.getElementById("app"), 6, 3);
