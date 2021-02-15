
//--------------------дэлгэцтэй ажиллах талбар-----------------------
var uiController = (function () {
    var DOMstring = {
        inputType: '.add__type',
        inputDesc: '.add__description',
        inputValue: '.add__value',
        addBtn: '.add__btn',
    }
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstring.inputType).value,
                description: document.querySelector(DOMstring.inputDesc).value,
                value: document.querySelector(DOMstring.inputValue).value
            }
        },
        getDOMstrings: function () {
            return DOMstring;
        },

        addListItem: function (item, type) {
            //Орлого зарлагыг агуулсан HTML бэлдэнэ
            var html, list;
            if (type === "inc") {
                list = '.income__list';
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%DESCRIPTION%</div><div class="right clearfix"><div class="item__value">+ %VALUE%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else {
                list = '.expenses__list';
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

    var data = {
        items: {
            inc: [],
            exp: []
        },

        totals: {
            inc: 0,
            exp: 0
        }
    };
    return {
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
        }
    };

})();



//-----------------------холбох талбар---------------------------------------
var appController = (function (uiController, financeController) {

    var ctrlAddItem = function () {
        //1. оруулах өгөгдлийг дэлгэцээс авна
        var input = uiController.getInput();

        //2. олж авсан өгөгдлөө санхүүгийн талбарлуу дамжуулж тэнд хадгална
        var item = financeController.addItem(input.type, input.description, input.value);

        //3. олж авсан өгөгдлүүдийг вэб дээрээ тохирох хэсэгт нь гаргана
        uiController.addListItem(item, input.type);
        //4. төсвийг тооцоолно.
        //5. эцсийн үлдэгдэл тооцоог дэлгэцэнд гаргана
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