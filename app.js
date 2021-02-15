
//--------------------дэлгэцтэй ажиллах талбар-----------------------
var uiController = (function () {
    var DOMstring = {
        inputType: '.add__type',
        inputDesc: '.add__description',
        inputValue: '.add__value',
        addBtn: '.add__btn',
        incomeList: '.income__list',
        expenseList: '.expenses__list'
    }
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstring.inputType).value,
                description: document.querySelector(DOMstring.inputDesc).value,
                //тэмдэгт мөрийг тоо руу хөрвүүлэх parseInt();
                value: parseInt(document.querySelector(DOMstring.inputValue).value)
            }
        },
        getDOMstrings: function () {
            return DOMstring;
        },

        clearFields: function () {
            var fields = document.querySelectorAll(DOMstring.inputDesc + ',' + DOMstring.inputValue);
            var fieldsArr = Array.prototype.slice.call(fields);

            //For давталт
            fieldsArr.forEach(function (el, index, array) {
                el.value = "";
            });
            fieldsArr[0].focus();
            // for (var i = 0; i < fieldsArr.length; i++) {
            //     fieldsArr[i].value = "";
            // };
        },

        addListItem: function (item, type) {
            //Орлого зарлагыг агуулсан HTML бэлдэнэ
            var html, list;
            if (type === "inc") {
                list = DOMstring.incomeList;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%DESCRIPTION%</div><div class="right clearfix"><div class="item__value">+ %VALUE%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else {
                list = DOMstring.expenseList;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%DESCRIPTION%</div><div class="right clearfix"><div class="item__value">- %VALUE%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            //HTML дотроо орлого зарлагын утгуудыг REPLACE ашиглан өөрчилж өгнө
            html = html.replace('%ID%', item.id);
            html = html.replace('%DESCRIPTION%', item.description);
            html = html.replace('%VALUE%', item.value);
            // бэлтгэсэн HTML ээ DOM руу хийж өгнө
            document.querySelector(list).insertAdjacentHTML('beforeend', html);
        }

    }

})();

//-------------------Санхүүтэй ажиллах талбар--------------------------------
var financeController = (function () {
    var Income = function (id, description, value) {
        this.id = id,
            this.description = description,
            this.value = value
    };
    var Expense = function (id, description, value) {
        this.id = id,
            this.description = description,
            this.value = value
    };

    var calculateTotal = function (type) {
        var sum = 0;
        data.items[type].forEach(function (el) {
            sum = sum + el.value;
        });

        data.totals[type] = sum;
    };

    var data = {
        items: {
            inc: [],
            exp: []
        },

        totals: {
            inc: 0,
            exp: 0
        },
        tusuv: 0,
        huvi: 0
    };
    return {
        tusuvTootsolooh: function () {
            calculateTotal('inc');
            calculateTotal('exp');

            data.tusuv = data.totals.inc - data.totals.exp;
            data.huvi = Math.round((data.totals.exp / data.totals.inc) * 100);
        },
        tosovAvah: function () {
            return {
                tusuv: data.tusuv,
                huvi: data.huvi,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp
            }
        },

        addItem: function (type, desc, val) {
            var item, id;
            if (data.items[type].length === 0) id = 1;
            else {
                id = data.items[type][data.items[type].length - 1].id + 1;
            }
            if (type === 'inc') {
                item = new Income(id, desc, val);
            }
            else {
                item = new Expense(id, desc, val);
            }
            data.items[type].push(item);

            return item;
        },
        seeData: function () {
            return data;
        }
    };

})();



//-----------------------холбох талбар---------------------------------------
var appController = (function (uiController, financeController) {

    var ctrlAddItem = function () {
        //1. оруулах өгөгдлийг дэлгэцээс авна
        var input = uiController.getInput();
        if (input.description !== "" && input.value !== "") {
            //2. олж авсан өгөгдлөө санхүүгийн талбарлуу дамжуулж тэнд хадгална
            var item = financeController.addItem(input.type, input.description, input.value);

            //3. олж авсан өгөгдлүүдийг вэб дээрээ тохирох хэсэгт нь гаргана
            uiController.addListItem(item, input.type);
            uiController.clearFields();
            //4. төсвийг тооцоолно.
            financeController.tusuvTootsolooh();
            //5. эцсийн үлдэгдэл гаргана
            var tusuv = financeController.tosovAvah();
            //6. тооцоог дэлгэцэнд гаргах
            console.log(tusuv);
        };

    }
    var setupEventListener = function () {
        var Dom = uiController.getDOMstrings();
        //товч дарах хэсэг
        document.querySelector(Dom.addBtn).addEventListener('click', function () {
            ctrlAddItem();
        });

        //KEYBOARDтай ажиллах хэсэг "enter дарах"
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    }
    return {
        init: function () {
            console.log('Программ эхэллээ...')
            setupEventListener();
        }
    }
})(uiController, financeController);

appController.init();