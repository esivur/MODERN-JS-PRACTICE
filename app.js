const budgetController = (() => {
  class Expense {
    constructor(id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
      this.percentage = -1;
    }

    calcPercentage(totalIncome) {
      if (totalIncome > 0) {
        this.percentage = Math.round((this.value / totalIncome) * 100);
      } else {
        this.percentage = -1;
      }
    }

    getPercentage() {
      return this.percentage;
    }
  }

  const Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const calculateTotal = (type) => {
    let sum = 0;
    data.allItems[type].forEach(({ value }) => {
      sum += value;
    });
    data.totals[type] = sum;
  };

  let data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
    budget: 0,
    percentage: -1,
  };

  return {
    addItem(type, des, val) {
      let newItem;
      let ID;

      //[1 2 3 4 5], next ID = 6
      //[1 2 4 6 8], next ID = 9
      // ID = last ID + 1

      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }

      data.allItems[type].push(newItem);

      return newItem;
    },

    deleteItem(type, id) {
      let ids;
      let index;

      // id = 6
      //data.allItems[type][id];
      // ids = [1 2 4  8]
      //index = 3

      ids = data.allItems[type].map((current) => current.id);

      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget() {
      calculateTotal("exp");
      calculateTotal("inc");

      data.budget = data.totals.inc - data.totals.exp;

      if (data.budget < 0) {
        alert("You are over budget!!!");
      }
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }

      // Expense = 100 and income 300, spent 33.333% = 100/300 = 0.3333 * 100
    },

    calculatePercentages() {
  
                  a=20
                  b=10
                  c=40
                  income = 100
                  a=20/100=20%
                  b=10/100=10%
                  c=40/100=40%

      data.allItems.exp.forEach((cur) => {
        cur.calcPercentage(data.totals.inc);
      });
    },

    getPercentages() {
      const allPerc = data.allItems.exp.map((cur) => cur.getPercentage());
      return allPerc;
    },

    getBudget() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage,
      };
    },

    testing() {
      console.log(data);
    },
  };
})();

const UIController = (() => {
  const DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
    expensesPercLabel: ".item__percentage",
    dateLabel: ".budget__title--month",
  };

  const formatNumber = (num) => {
    let numSplit;
    let int;
    let dec;

    /*
                  + or - before number
                  exactly 2 decimal points
                  comma separating the thousands
                  2310.4567 -> + 2,310.46
                  2000 -> + 2,000.00
                  */

    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split(".");

    int = numSplit[0];
    if (int.length > 3) {
      int = `${int.substr(0, int.length - 3)},${int.substr(int.length - 3, 3)}`; //input 23510, output 23,510
    }

    dec = numSplit[1];

 /* Task 1/2 */
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const nodeListForEach = (list, callback) => {
    for (let i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };

  return {
    getInput() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, 
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
      };
    },

    addListItem({ id, description, value }, type) {
      let html;
      let newHtml;
      let element;

      if (type === "inc") {
        element = DOMstrings.incomeContainer;

        html =
          '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMstrings.expensesContainer;

        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      newHtml = html.replace("%id%", id);
      newHtml = newHtml.replace("%description%", description);
      newHtml = newHtml.replace("%value%", formatNumber(value, type));


      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },

    deleteListItem(selectorID) {
      const el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    },

    clearFields() {
      let fields;
      let fieldsArr;

      fields = document.querySelectorAll(
        `${DOMstrings.inputDescription}, ${DOMstrings.inputValue}`
      );

      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach((current, index, array) => {
        current.value = "";
      });

      fieldsArr[0].focus();
    },

    displayBudget({ budget, totalInc, totalExp, percentage }) {
      let type;
      budget > 0 ? (type = "inc") : (type = "exp");

      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(
        budget,
        type
      );
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(
        totalInc,
        "inc"
      );
      document.querySelector(
        DOMstrings.expensesLabel
      ).textContent = formatNumber(totalExp, "exp");

      if (percentage > 0) {
        document.querySelector(
          DOMstrings.percentageLabel
        ).textContent = `${percentage}%`;
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = "---";
      }
    },

    displayPercentages(percentages) {
      const fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

      nodeListForEach(fields, (current, index) => {
        if (percentages[index] > 0) {
          current.textContent = `${percentages[index]}%`;
        } else {
          current.textContent = "---";
        }
      });
    },

    displayMonth() {
      let now;
      let months;
      let month;
      let year;

      now = new Date();
      var christmas = new Date(2016, 11, 25);

      months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      month = now.getMonth();

      year = now.getFullYear();
      document.querySelector(
        DOMstrings.dateLabel
      ).textContent = `${months[month]} ${year}`;
    },

    changedType() {
      const fields = document.querySelectorAll(
        `${DOMstrings.inputType},${DOMstrings.inputDescription},${DOMstrings.inputValue}`
      );

      nodeListForEach(fields, ({ classList }) => {
        classList.toggle("red-focus");
      });

      document.querySelector(DOMstrings.inputBtn).classList.toggle("red");
    },

    getDOMstrings() {
      return DOMstrings;
    },
  };
})();

const controller = ((budgetCtrl, UICtrl) => {
  const setupEventListeners = () => {
    const DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", ({ keyCode, which }) => {
      if (keyCode === 13 || which === 13) {
        ctrlAddItem();
      }
    });

    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlDeleteItem);

    document
      .querySelector(DOM.inputType)
      .addEventListener("change", UICtrl.changedType);
  };

  const updateBudget = () => {
 
    budgetCtrl.calculateBudget();


    const budget = budgetCtrl.getBudget();


    UICtrl.displayBudget(budget);
  };

  const updatePercentages = () => {
    budgetCtrl.calculatePercentages();

    const percentages = budgetCtrl.getPercentages();

    UICtrl.displayPercentages(percentages);
  };

  let ctrlAddItem = () => {
    let input;
    let newItem;

    // 1. Get the field input data
    input = UICtrl.getInput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // 2. Add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // 3. Add the item to the UI
      UICtrl.addListItem(newItem, input.type);

      // 4. Clear the fields
      UICtrl.clearFields();

      // 5. Calculate and update budget
      updateBudget();

      // 6. Calculate and update percentages
      updatePercentages();
    }
    if (input.description === "" || isNaN(input.value) || input.value < 0) {
      window.alert("Value is needed!");
    } else if (input.description == value) {
      alert("Description is invalid");
    }

    // task 4 is here
    // if(input.description == "" || isNaN(input.value) || input.value < 0){
    //   alert("Value needed!");
    // }
    // } else if (input.description === "" || isNaN(input.value)) {
    //   window.alert("Must add a description!")
    // }
    // console.log(input.value);
  };

  const ctrlDeleteItem = ({ target }) => {
    let itemID;
    let splitID;
    let type;
    let ID;

    itemID = target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      splitID = itemID.split("-");
      type = splitID[0];
      ID = parseInt(splitID[1]);

      budgetCtrl.deleteItem(type, ID);

      UICtrl.deleteListItem(itemID);

      updateBudget();

      updatePercentages();
    }
  };

  return {
    init() {
      console.log("Application has started.");
      UICtrl.displayMonth();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1,
      });
      setupEventListeners();
    },
  };
})(budgetController, UIController);

controller.init();
