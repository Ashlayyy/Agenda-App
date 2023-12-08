class AgendaApp {
    api = undefined;
    switcher = undefined;
    month = undefined
    constructor() {
        this.api = new API();
        this.switcher = new Switcher(this);
        this.month = new Date().getMonth();
        this.api.getData().then((result) => {
            this.switcher.loadAgenda(result[this.month]);
        });
    }
    switchMonths = (sign) => {
        switch (sign) {
            case "+":
                this.month = this.month + 1;
                break;
            case "-":
                this.month = this.month - 1;
                break;
        }
        console.log(this.month)
        if (this.month === 12) {
            this.month = 0;
        }
        if (this.month < 0) {
            this.month = 11;
        }
        this.switcher.loadAgenda(this.api.dataFromAPI[this.month]);
    };
}
class API {
    dataFromAPI = [];
    async getData() {
        await fetch("./data/data.json")
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                this.dataFromAPI = data.months;
            });
        return this.dataFromAPI;
    }
}
class Agenda {
    renderer = undefined;
    header = undefined;
    month = undefined;
    htmlElement = undefined;
    agendaApp = undefined;
    constructor(data, agendaApp) {
        this.agendaApp = agendaApp;
        this.htmlElement = document.createElement("article");
        this.htmlElement.classList.add("agenda");
        this.data = data;
        this.renderer = new Renderer();
        this.renderer.render("section", this.htmlElement);
        this.header = new Header(this, data.name, this.agendaApp);
        this.month = new Month(this, data.days);
    }
    render(placeToRender, whatToRender) {
        this.renderer.render(placeToRender, whatToRender);
    }
}
class Header {
    nameOfMonth = undefined;
    htmlElement = undefined;
    agenda = undefined;
    leftButton = undefined;
    rightButton = undefined;
    agendaApp = undefined;
    Switcher = undefined;
    constructor(agenda, nameOfMonth, agendaApp) {
        this.agenda = agenda;
        this.agendaApp = agendaApp;
        this.nameOfMonth = nameOfMonth;
        this.htmlElement = document.createElement("header");
        this.htmlElement.classList.add("agenda__header");
        this.text = document.createElement("h2");
        this.agenda.render(".agenda", this.htmlElement);
        this.leftButton = new Button(
            "previous",
            "<",
            "agenda--left",
            this,
            this.agendaApp
        );
        this.agenda.render(".agenda__header", this.text);
        this.rightButton = new Button(
            "next",
            ">",
            "agenda--right",
            this,
            this.agendaApp
        );
        this.text.innerText = this.nameOfMonth;
    }
    render(placeToRender, whatToRender) {
        this.agenda.render(placeToRender, whatToRender);
    }
}
class Button {
    htmlElement = undefined;
    innerText = undefined;
    extraClass = undefined;
    header = undefined;
    agendaApp = undefined;
    type = undefined;
    constructor(type, innerText, extraClass, header, agendaApp) {
        this.type = type;
        this.agendaApp = agendaApp;
        this.htmlElement = document.createElement("button");
        this.htmlElement.classList.add("agenda__button");
        this.extraClass = extraClass;
        this.htmlElement.classList.add(this.extraClass);
        this.innerText = innerText;
        this.htmlElement.innerText = this.innerText;
        this.header = header;
        this.render();
        this.htmlElement.onclick = this.buttonClicked;
    }
    buttonClicked = () => {
        console.log(this)
        if (this.type === "previous") {
            return this.agendaApp.switchMonths("-");
        }
        this.agendaApp.switchMonths("+");
    };
    render() {
        this.header.render("header", this.htmlElement);
    }
}
class Switcher {
    agendaApp = undefined;
    agenda = undefined;
    cleaner = undefined;
    constructor(agendaApp) {
        this.agendaApp = agendaApp;
        this.cleaner = new Cleaner();
    }
    loadAgenda = (data) => {
        this.cleaner.clean("section");
        this.agenda = new Agenda(data, this.agendaApp);
    };
}
class Month {
    days = [];
    agenda = undefined;
    numberOfDays = undefined;
    htmlElement = undefined;
    constructor(agenda, numberOfDays) {
        this.htmlElement = document.createElement("ul");
        this.htmlElement.classList.add("agenda__month");
        this.numberOfDays = numberOfDays;
        this.agenda = agenda;
        this.agenda.render(".agenda", this.htmlElement);
        for (let i = 1; i <= numberOfDays; i++) {
            this.days.push(new Day(this, i));
        }
    }
    renderDay(placeToRender, whatToRender) {
        this.agenda.render(placeToRender, whatToRender);
    }
}
class Day {
    month = undefined;
    htmlElement = undefined;
    dayNumber = undefined;
    constructor(month, dayNumber) {
        this.dayNumber = dayNumber;
        this.htmlElement = document.createElement("li");
        this.htmlElement.classList.add("agenda__day");
        this.htmlElement.innerText = this.dayNumber;
        this.month = month;
        this.month.renderDay(".agenda__month", this.htmlElement);
    }
}