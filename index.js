// Объявление переменных
let comments = [];
loadComments();

let formGroup = document.querySelectorAll(".form-group");

let name = document.getElementById("form-name");
let comment = document.getElementById("form-comment");
let date = document.getElementById("form-date");

// Удаление сообщений об ошибке
name.oninput = () => {
    let errorMessage = formGroup[0].querySelector(".error-message");
    if (errorMessage) errorMessage.remove();
    return;
};
comment.oninput = () => {
    let errorMessage = formGroup[1].querySelector(".error-message");
    if (errorMessage) errorMessage.remove();
    return;
};
date.oninput = () => {
    let errorMessage = formGroup[2].querySelector(".error-message");
    if (errorMessage) errorMessage.remove();
    return;
};

// Форма добавления комментария
document.getElementById("add-comment").onclick = (e) => {
    e.preventDefault();

    if (isInvalidName(name) || isInvalidComment(comment) || isInvalidDate(date)) return;

    let result = {
        name: name.value,
        comment: comment.value,
        date: dayConverter(date.value),
        time: Date.now(),
        liked: false
    };

    name.value = "";
    comment.value = "";
    date.value = "";

    comments.unshift(result);
    saveComments();
    showComments();
};

// Валидация
function isInvalidName(name) {
    let condition = !name.value || name.value.length > 15 || (name.value.includes("<") && name.value.includes(">"));
    if (condition) {
        errorName();
        return condition;
    }
}

function isInvalidComment(comment) {
    let condition =
        !comment.value || comment.value.length > 200 || (comment.value.includes("<") && comment.value.includes(">"));
    if (condition) {
        errorComment();
        return condition;
    }
}

function isInvalidDate(date) {
    let today = new Date();
    let day = new Date(date.value);

    if (today < day) {
        errorDate();
        return true;
    }
}

function errorName() {
    let name = document.getElementById("name");
    let errorMessage =
        '<p class="error-message">Некорректное имя. Имя не должно содержать более 15 символов или символы "<", ">".</p>';

    if (!formGroup[0].querySelector(".error-message")) {
        name.insertAdjacentHTML("afterend", errorMessage);
    }

    return;
}

function errorComment() {
    let comment = document.getElementById("comment");
    let errorMessage =
        '<p class="error-message">Некорректный комментарий. Комментарий не должен содержать более 200 символов или символы "<", ">".</p>';

    if (!formGroup[1].querySelector(".error-message")) {
        comment.insertAdjacentHTML("afterend", errorMessage);
    }

    return;
}

function errorDate() {
    let date = document.getElementById("date");

    let d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth() < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
    let day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();

    let errorMessage = `<p class="error-message">Некорректная дата. Нельзя указать дату больше чем ${day}-${month}-${year}.</p>`;

    if (!formGroup[2].querySelector(".error-message")) {
        date.insertAdjacentHTML("afterend", errorMessage);
    }

    return;
}

// Рендер комментариев
function showComments() {
    let commentsField = document.querySelector(".comments-field");
    let tag = "";

    comments.map(
        (elem) =>
            (tag += `<div class="comment" data-key="${elem.time}">
                    <div class="comment-info">
                        <div class="comment-left-bar">
                            <img src="./image/PersonalPhoto.png" alt=""/>
                            <p>${elem.name}</p>
                            <p>
                                <span>${elem.date},</span>
                                <span>${timeConverter(elem.time)}</span>
                            </p>
                        </div>
                        <div class="comment-right-bar">
                            <img src="https://img.icons8.com/ios/25/000000/delete-trash.png" alt=""/>
                        </div>
                    </div>
                    <div class="comment-content">
                        <p>${elem.comment}</p>
                    </div>
                    <div class="comment-likes-count">
                        <span>
                            <img src="https://img.icons8.com/ios/30/000000/facebook-like--v1.png" alt=""/>
                            <sup>${+elem.liked}</sup>
                        </span>
                    </div>
                </div>`)
    );

    commentsField.innerHTML = tag;

    // Удаление комментария, выставление лайка
    for (const comment of document.querySelectorAll(".comment")) {
        let trash = comment.querySelector(".comment-right-bar img");
        let like = comment.querySelector(".comment-likes-count span img");
        let countLikes = comment.querySelector(".comment-likes-count span sup");

        like.onclick = () => {
            [...comments].map((el) => {
                el.time === +comment.dataset.key ? { ...el, ...(el.liked = !el.liked) } : { ...el, ...el.liked };
                return el;
            });

            countLikes.textContent === "0" ? countLikes.textContent++ : countLikes.textContent--;

            saveComments();
        };

        trash.onclick = () => {
            let deleteID = [...comments].findIndex((el) => el.time === +comment.dataset.key);

            comment.remove();
            comments.splice(deleteID, 1);

            saveComments();
        };
    }
}

// Сохранение в localstorage
function saveComments() {
    localStorage.setItem("comments", JSON.stringify(comments));
}

function loadComments() {
    if (localStorage.getItem("comments")) comments = JSON.parse(localStorage.getItem("comments"));
    showComments();
}

// Вспомогательные функции
function dayConverter(date) {
    let today = new Date().getDate();
    let day = date.slice(-2);

    if (today - day === 1) return "Вчера";
    if (today - day === 0 || !date) return "Сегодня";

    return date;
}

function timeConverter(timestamp) {
    let d = new Date(timestamp);

    let hour = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
    let minutes = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();

    let time = `${hour}:${minutes}`;
    return time;
}
