class AgendaApp {
  api = undefined;
  //Maakt de property api aan
  switcher = undefined;
  //Maakt de property switcher aan
  month = undefined
  //Maakt de property month aan
  constructor() {
    this.api = new API();
    //Maakt een nieuwe Api object aan
    this.switcher = new Switcher(this);
    //Maakt een nieuwe Switcher object aan
    this.month = new Date().getMonth();
    //Zet de maand waarop hij moet beginnen naar de maand waarin je je nu bevind.
    this.api.getData().then((result) => {
      this.switcher.loadAgenda(result[this.month]);
      //Opent de agenda op de maand waarin je ook zit in het echte leven
    });
  }

  //Maakt een functie aan
  switchMonths = (sign) => {
    //Switch statement om te kijken of je kijken of het plus of min is
    switch (sign) {
      //Als het plus is, voeg er een maand boven op
      case "+":
        return this.month = this.month + 1;
        //Als het min is ga er eentje naar beneden
      case "-":
        return this.month = this.month - 1;
      //Ik gebruik hier ook geen break statements, maar returns, zodat de code kleiner is en ze eigenlijk hetzelfde werken.
    }
    //Zorgt ervoor dat je geen undefined krijgt wnr je aan het scrollen ben
    if (this.month === 12) {
      this.month = 0;
    }
    if (this.month < 0) {
      this.month = 11;
    }

    //Laat vervolgens de agenda via de switcher
    this.switcher.loadAgenda(this.api.dataFromAPI[this.month]);
  };
}

class API {
  //Maakt de property dataFromApi aan, dit is een array
  dataFromAPI = [];

  //maakt een functie aan die de data gaat ophalen  uit het bestand
  async getData() {
    //Haalt de gegevens op
    await fetch("../data/data.json")
      .then((response) => {
        //Converts it to json format
        return response.json();
      })
      .then((data) => {
        //Zet de property die we hebben aangemaakt naar de date die we zojuist hebben ontvangen
        this.dataFromAPI = data.months;
      });
    //Stuurt de data terug met een return
    return this.dataFromAPI;
  }
}

class Agenda {
  //Maakt alle propertys aan, sorry, had geen zin om overal echt elke regel iets neer te zetten. Ik snap het allemaal wel haha.
  renderer = undefined;
  header = undefined;
  month = undefined;
  htmlElement = undefined;
  agendaApp = undefined;

  constructor(data, agendaApp) {
    //Zet de agenda app in dit object gelijk aan degene die hij binnenkrijgt
    this.agendaApp = agendaApp;
    //maakt een element aan om het straks in te plaatsen
    this.htmlElement = document.createElement("article");
    this.htmlElement.classList.add("agenda");
    //Zet de data in dit object naar wat je binnenkrijgt
    this.data = data;
    //Maakt een renderer aan
    this.renderer = new Renderer();
    //Rendert wat hij heeft gemaakt hierboven op de body
    this.renderer.render("body", this.htmlElement);
    //Maakt een maand en de header aan
    this.header = new Header(this, data.name, this.agendaApp);
    this.month = new Month(this, data.days);
  }

  //Maakt een functie aan zodat ander eobject ook gebruik kunnen maken van de renderer die hier wordt aangemaakt
  render(placeToRender, whatToRender) {
    this.renderer.render(placeToRender, whatToRender);
  }
}

class Header {
  //Maakt alle properties aan die worden gebruikt
  nameOfMonth = undefined;
  htmlElement = undefined;
  agenda = undefined;
  leftButton = undefined;
  rightButton = undefined;
  agendaApp = undefined;

  constructor(agenda, nameOfMonth, agendaApp) {
    //Zet alles in dit object wat we binnenkrijgen
    this.agenda = agenda;
    this.agendaApp = agendaApp;
    this.nameOfMonth = nameOfMonth;
    //Maakt vervolgens een header element en rendert deze
    this.htmlElement = document.createElement("header");
    this.htmlElement.classList.add("agenda__header");
    this.text = document.createElement("h2");
    this.agenda.render(".agenda", this.htmlElement);

    //Maakt de previous button aan
    this.leftButton = new Button(
      "previous",
      "<",
      "agenda--left",
      this,
      this.agendaApp
    );
    //Rendert deze ook
    this.agenda.render(".agenda__header", this.text);
    //Maakt de next button aan
    this.rightButton = new Button(
      "next",
      ">",
      "agenda--right",
      this,
      this.agendaApp
    );
    this.text.innerText = this.nameOfMonth;
  }
  //Maakt weer een render functie aan
  render(placeToRender, whatToRender) {
    this.agenda.render(placeToRender, whatToRender);
  }
}

class Button {
  //Maakt alle properties aan die dit object gaat gebruiken
  htmlElement = undefined;
  innerText = undefined;
  extraClass = undefined;
  Switcher = undefined;
  header = undefined;
  agendaApp = undefined;
  type = undefined;

  constructor(type, innerText, extraClass, header, agendaApp) {
    //Zet alles in dit object wat we binnenkrijgen
    this.type = type;
    this.agendaApp = agendaApp;
    //Maakt een element en rendert deze
    this.htmlElement = document.createElement("button");
    this.htmlElement.classList.add("agenda__button");
    this.extraClass = extraClass;
    this.htmlElement.classList.add(this.extraClass);
    this.innerText = innerText;
    this.htmlElement.innerText = this.innerText;

    this.header = header;
    this.render();

    //Zet een onclick element per button
    this.htmlElement.onclick = this.buttonClicked;
  }

  buttonClicked = () => {
    //Kijkt welke knmop was gedrukt, op basis daarvan doet hij dingen
    if (this.type === "previous") {
      return this.agendaApp.switchMonths("-");
    }
    this.agendaApp.switchMonths("+");
  };

  //Weer een render functie die de header gebruikt om te renderen
  render() {
    this.header.render("header", this.htmlElement);
  }
}

class Switcher {
  //Maakt alle properties aan
  agendaApp = undefined;
  agenda = undefined;
  cleaner = undefined;

  constructor(agendaApp) {
    //Zet alles in dit object wat we binnenkrijgen en maakt een nieuwe cleaner
    this.agendaApp = agendaApp;
    this.cleaner = new Cleaner();
  }

  //Laadt de agenda met de data die wordt meegestuurd
  loadAgenda = (data) => {
    //Leegt eerst de body
    this.cleaner.clean("body");
    //En daarna de nieuwe agenda erin
    this.agenda = new Agenda(data, this.agendaApp);
  };
}

class Month {
  //Maakt alle properties aan
  days = [];
  agenda = undefined;
  numberOfDays = undefined;
  htmlElement = undefined;

  constructor(agenda, numberOfDays) {
    //Maakt element aan en voegt een class toe, en voegt vervolgens alle dagen toe
    this.htmlElement = document.createElement("ul");
    this.htmlElement.classList.add("agenda__month");
    this.numberOfDays = numberOfDays;
    this.agenda = agenda;
    this.agenda.render(".agenda", this.htmlElement);
    for (let i = 1; i <= numberOfDays; i++) {
      //Geeft zichzelf mee en het nummer
      this.days.push(new Day(this, i));
    }
  }

  //render function for the days
  renderDay(placeToRender, whatToRender) {
    this.agenda.render(placeToRender, whatToRender);
  }
}

class Day {
  //Maakt alle properties aan die hij gebruikt
  month= undefined;
  htmlElement = undefined;
  dayNumber = undefined;

  constructor(month, dayNumber) {
    //Zet alle properties naar wat hij binnenkrijgt
    this.dayNumber = dayNumber;
    this.htmlElement = document.createElement("li");
    this.htmlElement.classList.add("agenda__day");
    this.htmlElement.innerText = this.dayNumber;
    //Rendert de dag naar de maand zodat het goed erin komt
    this.month = month;
    this.month.renderDay(".agenda__month", this.htmlElement);
  }
}