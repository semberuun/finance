
//дэлгэцтэй ажиллах талбар
var uiController = (function () {

})();


//Санхүүтэй ажиллах талбар
var financeController = (function () {

})();

var ctrlAddItem = function () {
    //1. оруулах өгөгдлийг дэлгэцээс авна
    console.log("дэлгэцээс мэдээлэл авлаа");
    //2. олж авсан өгөгдлөө санхүүгийн талбарлуу дамжуулж тэнд хадгална
    //3. олж авсан өгөгдлүүдийг вэб дээрээ тохирох хэсэгт нь гаргана
    //4. төсвийг тооцоолно.
    //5. эцсийн үлдэгдэл тооцоог дэлгэцэнд гаргана
}

//холбох талбар
var appController = (function (uiController, financeController) {
    document.querySelector('.add__btn').addEventListener('click', function () {
        ctrlAddItem();
    });

    //KEYBOARDтай ажиллах хэсэг "enter дарах"
    document.addEventListener('keypress', function (event) {
        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }
    });
})(uiController, financeController);