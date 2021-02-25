
//--------------------дэлгэцтэй ажиллах талбар-----------------------
var uiController = (function () {
    var DOMstring = {
        inputType: '.add__type',
        inputDesc: '.add__description',
        inputValue: '.add__value',
        addBtn: '.add__btn',
        incomeList: '.income__list',
        expenseList: '.expenses__list',
        tusuvLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        persantageLabel: '.budget__expenses--percentage',
        containerDiv: '.container '
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
        tusviigUzuuleh: function (tusuv) {
            document.querySelector(DOMstring.tusuvLabel).textContent = tusuv.tusuv;
            document.querySelector(DOMstring.incomeLabel).textContent = tusuv.totalInc;
            document.querySelector(DOMstring.expenseLabel).textContent = tusuv.totalExp;
            document.querySelector(DOMstring.persantageLabel).textContent = tusuv.huvi + '%';
        },

        deleteListItem: function (id) {
            var el = document.getElementById(id);
            el.parentNode.removeChild(el);
        },


        addListItem: function (item, type) {
            //Орлого зарлагыг агуулсан HTML бэлдэнэ
            var html, list;
            if (type === "inc") {
                list = DOMstring.incomeList;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%DESCRIPTION%</div><div class="right clearfix"><div class="item__value">+ %VALUE%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else {
                list = DOMstring.expenseList;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%DESCRIPTION%</div><div class="right clearfix"><div class="item__value">- %VALUE%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            //HTML дотроо орлого зарлагын утгуудыг REPLACE ашиглан өөрчилж өгнө
            html = html.replace('%id%', item.id);
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
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.persentage = -1;
    };
    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0)
            this.persentage = Math.round((this.value / totalIncome) * 100);
        else this.persentage = 0;
    };
    Expense.prototype.getPercentage = function () {
        return this.persentage;
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
            if (data.totals.inc > 0)
                data.huvi = Math.round((data.totals.exp / data.totals.inc) * 100);
            else data.huvi = 0;
        },
        calculatePercentages: function () {
            data.items.exp.forEach(function (el) {
                el.calcPercentage(data.totals.inc);
            });
        },
        getPercentages: function () {
            var allPercentages = data.items.exp.map(function (el) {
                return el.getPercentage();
            });

            return allPercentages;
        },
        tosovAvah: function () {
            return {
                tusuv: data.tusuv,
                huvi: data.huvi,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp
            }
        },

        deleteItem: function (type, id) {
            var ids = data.items[type].map(function (el) {
                return el.id;
            });
            var index = ids.indexOf(id);
            if (index !== -1) {
                data.items[type].splice(index, 1);
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
            updateTusuv();
        };
    }
    var updateTusuv = function () {
        //4. төсвийг тооцоолно.
        financeController.tusuvTootsolooh();

        //5. эцсийн үлдэгдэл гаргана
        var tusuv = financeController.tosovAvah();

        //6. тооцоог дэлгэцэнд гаргах
        uiController.tusviigUzuuleh(tusuv);

        // элементүүдийн хувийг тодорхойлно
        financeController.calculatePercentages();

        //элементүүдийг хувийг хүлээж авна
        var allPercentages = financeController.getPercentages();

        //эдгээр хувийг дэлгэцэнд гаргана
        console.log(allPercentages);
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
        document.querySelector(Dom.containerDiv).addEventListener('click', function (event) {
            var id = event.target.parentNode.parentNode.parentNode.parentNode.id;
            if (id) {
                var arr = id.split("-");
                var type = arr[0];
                var itemId = parseInt(arr[1]);
                //Санхүүгийн модулиас type, id ашиглан устгах
                financeController.deleteItem(type, itemId);
                //Дэлгэцэн дээрээс энэ элемент ашиглан устгах
                uiController.deleteListItem(id);
                //Үлдэгдэл тооцоог шинчилж харуулах
                updateTusuv();
            }
        });
    }
    return {
        init: function () {
            console.log('Программ эхэллээ...');
            uiController.tusviigUzuuleh({
                tusuv: 0,
                huvi: 0,
                totalInc: 0,
                totalExp: 0
            })
            setupEventListener();
        }
    }
})(uiController, financeController);

appController.init();