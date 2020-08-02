var budgetController = (function() {
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var calculateTotal = function(type) {
      var sum = 0;
      data.allItems[type].forEach(function(currElement) {
          sum += cur.value;
      });
      data.totals[type] = sum;
    };
    
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };
    
    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            
            if (type === 'inc' || type === 'exp') {
                var itemsArray = data.allItems[type];
                var totals = data.totals[type];
                
                if (itemsArray.length === 0) {
                    ID = 0;
                } else {
                    ID = itemsArray[itemsArray.length - 1] + 1;
                }
                
                if (type === 'inc') {
                    newItem = new Expense(ID, des, val);
                } else {
                    newItem = new Income(ID, des, val);
                }
                
                itemsArray.push(newItem);
                
                totals += val;
            }
            
            return newItem;
        },
        
        calculateBudget: function() {
            calculateTotal('inc');
            calculateTotal('exp');
            
            data.budget = data.totals.inc - data.totals.exp;
            
            data.percentage = data.totals.exp / data.totals.inc;
        },
        
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc, 
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        }
        
    }
})();

var UIController = (function() {
    var DOMstrings = {
        inputType: '.add__type',
        description: '.add__description',
        value: '.add__value',
        inputBtn: '.add__btn',
        incomeList: '.income__list',
        expensesList: '.expenses__list',
        budgetValue: '.budget__value',
        budgetIncValue: '.budget__income--value',
        budgetExpValue: '.budget__expenses--value',
        budgetExpPercentage: '.budget__expenses--percentage'
    }
    
    return {
        getinput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.description).value,
                value: parseFloat(document.querySelector(DOMstrings.value).value)
            }
        },
        
        addListItem: function(budgetItemObj, type) {
            var budgetItemHTML, listClass;
            if (type === 'inc') {
                listClass = DOMstrings.incomeList;
                budgetItemHTML = `<div class="item clearfix" id="income-` + budgetItemObj.id + `">
                            <div class="item__description">` + budgetItemObj.description + `</div>
                            <div class="right clearfix">
                                <div class="item__value">` + budgetItemObj.value + `</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div>`;
            } else if (type === 'exp') {
                listClass = DOMstrings.expensesList;
                budgetItemHTML = `<div class="item clearfix" id="expense-` + budgetItemObj.id + `">
                            <div class="item__description">` + budgetItemObj.description + `</div>
                            <div class="right clearfix">
                                <div class="item__value">` + budgetItemObj.value + `</div>
                                <div class="item__percentage">` + budgetItemObj.id + `</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div>`;
            }
            var listDOM = document.querySelector(listClass);
            listDOM.insertAdjacentHTML('afterbegin', budgetItemHTML);
        },
        
        clearFields: function() {
            var fields;
            var fieldsArr;
            
            fields = document.querySelectorAll(DOMstrings.description + ', ' + DOMstrings.value);
            
            fieldsArr = Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function(current, index, array) {
                current.value = '';
            });
            
            fieldsArr[0].focus();
        },
        
        getDOMstrings: function() {
            return DOMstrings;
        }
    }
})();

var controller = (function(budgetCtrl, UICtrl) {
    var setupEventListeners = function() {
        document.querySelector(DOMstrings.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keydown', function(event) {
            if(event.keyCode === 13 || event.which === 13) {
                event.preventDefault();
                ctrlAddItem();
            }
        });
    };
    var DOMstrings = UICtrl.getDOMstrings();
    var updateBudget = function() {
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();
        
        // 2. Return the budget
        var budget = budgetCtrl.getBudget();
        
        // 3. Display the budget on the UI
        
      
    };
    var ctrlAddItem = function() {
        // 1. Get the field of input data
        var input = UICtrl.getinput();
        
        if (input.description != "" && !isNan(input.value) && input.value !== 0) {
            // 2. Add the item to the budget controller
            var newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            
            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);
            
            // 4. Clear the fields
            UICtrl.clearFields();
        
            // 5. Calculate and update budget
            updateBudget();
        }
    }
    
    return {
        init: function() {
            setupEventListeners();
        }
    };
    
})(budgetController, UIController);

controller.init();
