console.log("MyTools Loaded");

const Tools = {
  pax: async () => {
    $("#execute")
      .addClass("loading-animation")
      .html(
        "<i class='extended-glyphicons glyphicons glyphicons-refresh'></i>"
      );
    let tickets, config, route, profit, stopover, demand;
    let dep = Func.data.get.airport($("#inp-dep").val());
    let arr = Func.data.get.airport($("#inp-arr").val());
    let ac = Func.data.get.plane($("#inp-ac").val());
    if (!dep) {
      $("#execute")
        .removeClass("loading-animation")
        .html("<i class='fa fa-search'></i> Calculate!");
      return UI.alertBox(S.err.vdep, "#fa3737");
    }
    if (!arr) {
      $("#execute")
        .removeClass("loading-animation")
        .html("<i class='fa fa-search'></i> Calculate!");
      return UI.alertBox(S.err.varr, "#fa3737");
    }
    if (!ac) {
      $("#execute")
        .removeClass("loading-animation")
        .html("<i class='fa fa-search'></i> Calculate!");
      return UI.alertBox(S.err.vac, "#fa3737");
    }
    let flpd = $("#inp-flpd").val();
    let rep = $("#inp-rep").val();
    let fp = $("#inp-fp").val();
    let cp = $("#inp-cp").val();
    let mode = UI.switch("inp-mode-1");
    let sm = UI.switch("inp-sm-1");
    let fm = UI.switch("inp-fm-1");
    let qm = UI.switch("inp-qm-1");
    ac = Func.mod(ac, sm, fm, qm);
    if (!mode) {
      ac.rwy = 0;
      ac.speed = Math.round(ac.speed * 1.5);
      ac.mC = Math.round(ac.mC / 2);
    }
    route = await Func.api.route(dep.ic, arr.ic);
    if (!flpd) flpd = Func.flpd(ac.speed, route.dist);
    if (!rep) rep = 90;
    if (!fp) fp = 600;
    if (!cp) cp = 120;
    if (rep < 11)
      UI.alertBox("Reputation must be greater than 10%!", "#fa3737");
    if (flpd > Func.flpd(ac.speed, route.dist))
      UI.alertBox(
        "You can't operate the desired amount of flights!",
        "#fa3737"
      );
    if (dep.r < ac.rwy || arr.r < ac.rwy) {
      $("#execute")
        .removeClass("loading-animation")
        .html("<i class='fa fa-search'></i> Calculate!");
      return UI.alertBox(S.err.rwy_short, "#fa3737");
    }
    if (mode) {
      tickets = [
        Basics.pax.ticket.realY(route.dist - 1.5),
        Basics.pax.ticket.realJ(route.dist - 1.5),
        Basics.pax.ticket.realF(route.dist - 1.5),
      ];
    } else
      tickets = [
        Basics.pax.ticket.easyY(route.dist - 1.5),
        Basics.pax.ticket.easyJ(route.dist - 1.5),
        Basics.pax.ticket.easyF(route.dist - 1.5),
      ];
    config = Basics.pax.config(
      ac.cap,
      route.dist,
      flpd,
      route.y,
      route.j,
      route.f,
      mode,
      true
    );
    profit = Basics.pax.profit.specific(
      ac,
      mode,
      route.dist,
      config[0],
      config[1],
      config[2],
      fp,
      cp,
      rep,
      flpd,
      false
    );
    if (route.dist > ac.range) {
      stopover = Basics.airports.stopover(dep, arr, ac.range, ac.rwy);
    } else stopover = false;
    demand = [route.y, route.j, route.f];
    if (!config[3]) UI.alertBox(S.err.no_dem, "#fa3737");
    $("#ans-yp").text("$" + tickets[0]);
    $("#ans-jp").text("$" + tickets[1]);
    $("#ans-fp").text("$" + tickets[2]);
    $("#ans-ys").text("x " + config[0]);
    $("#ans-js").text("x " + config[1]);
    $("#ans-fs").text("x " + config[2]);
    $("#ans-pf").text("$" + Func.cn(profit[0]));
    $("#ans-pd").text("$" + Func.cn(profit[1]));
    $("#ans-ph1").text("Profit/Flight");
    $("#ans-ph2").text("Profit/Day");
    if (stopover && Func.error.check(stopover, "ERR_DESTINATION_UNREACHABLE")) {
      $("#execute")
        .removeClass("loading-animation")
        .html("<i class='fa fa-search'></i> Calculate!");
      return UI.alertBox(S.err.unreachable);
    }
    if (!stopover) {
      $("#ans-t-4").hide();
    } else {
      $("#ans-t-4").show();
      $("#ans-table-box-inner-box-4 table").empty()
        .append(`<h4><span id="ans-name"></span><br><span id="ans-icia"></span></h4>
            <table style="width: 90%; max-width: 175px; margin: auto">
                <tr><td style="text-align: left"><i class="fa fa-plus"></i></td><td style="text-align: right" id="ans-exd"></td></tr>
                <tr><td style="text-align: left"><i class="extended-glyphicons glyphicons glyphicons-vector-path-curve"></i></td><td style="text-align: right" id="ans-totd"></td></tr>
            </table>`);
      $("#ans-name").text(`${stopover[0].n}, ${stopover[0].c}`);
      $("#ans-icia").text(`${stopover[0].ia} | ${stopover[0].ic}`);
      $("#ans-exd").text("+ " + stopover[0].extdist + " km");
      $("#ans-totd").text(stopover[0].dist + " km");
      // $("#ans-ph3").text("Add. Distance")
      // $("#ans-ph4").text("Total Distance")
    }
    $("#result-title").html(
      `${dep.ic} <i class="fa fa-exchange-alt"></i> ${arr.ic}`
    );
    $("#tool-inp").hide();
    $("#tool-ans").show();
    $("#execute")
      .removeClass("loading-animation")
      .html("<i class='fa fa-search'></i> Calculate!");
  },
  cargo: async () => {
    $("#execute")
      .addClass("loading-animation")
      .html(
        "<i class='extended-glyphicons glyphicons glyphicons-refresh'></i>"
      );
    let tickets, config, route, profit, stopover, demand;
    let dep = Func.data.get.airport($("#inp-dep").val());
    let arr = Func.data.get.airport($("#inp-arr").val());
    let ac = Func.data.get.cargo($("#inp-ac").val());
    let lTraining = $("#inp-lt").val(),
      hTraining = $("#inp-ht").val();
    if (!dep) {
      $("#execute")
        .removeClass("loading-animation")
        .html("<i class='fa fa-search'></i> Calculate!");
      return UI.alertBox(S.err.vdep, "#fa3737");
    }
    if (!arr) {
      $("#execute")
        .removeClass("loading-animation")
        .html("<i class='fa fa-search'></i> Calculate!");
      return UI.alertBox(S.err.varr, "#fa3737");
    }
    if (!ac) {
      $("#execute")
        .removeClass("loading-animation")
        .html("<i class='fa fa-search'></i> Calculate!");
      return UI.alertBox(S.err.vac, "#fa3737");
    }
    let flpd = $("#inp-flpd").val();
    let rep = $("#inp-rep").val();
    let fp = $("#inp-fp").val();
    let cp = $("#inp-cp").val();
    let mode = UI.switch("inp-mode-1");
    let sm = UI.switch("inp-sm-1");
    let fm = UI.switch("inp-fm-1");
    let qm = UI.switch("inp-qm-1");
    ac = Func.mod(ac, sm, fm, qm);
    if (!mode) {
      ac.rwy = 0;
      ac.speed = Math.round(ac.speed * 1.5);
    } else ac.mC = ac.mC * 2;
    route = await Func.api.route(dep.ic, arr.ic);
    if (!flpd) flpd = Func.flpd(ac.speed, route.dist);
    if (!rep) rep = 90;
    if (!fp) fp = 600;
    if (!cp) cp = 120;
    if (rep < 11)
      UI.alertBox("Reputation must be greater than 10%!", "#fa3737");
    if (flpd > Func.flpd(ac.speed, route.dist))
      UI.alertBox(
        "You can't operate the desired amount of flights!",
        "#fa3737"
      );
    if (dep.r < ac.rwy || arr.r < ac.rwy) {
      $("#execute")
        .removeClass("loading-animation")
        .html("<i class='fa fa-search'></i> Calculate!");
      return UI.alertBox(S.err.rwy_short, "#fa3737");
    }
    if (mode) {
      tickets = [
        Basics.cargo.ticket.realLarge(route.dist - 1.5),
        Basics.cargo.ticket.realHeavy(route.dist - 1.5),
      ];
    } else
      tickets = [
        Basics.cargo.ticket.easyLarge(route.dist - 1.5),
        Basics.cargo.ticket.easyHeavy(route.dist - 1.5),
      ];
    config = Basics.cargo.config(
      ac.cap,
      route.l,
      route.h,
      flpd,
      lTraining,
      hTraining,
      true
    );
    let parsedLT = Func.cargoTraining(Number(lTraining)),
      parsedHT = Func.cargoTraining(Number(hTraining));
    let lc = Math.round(ac.cap * 0.7 * parsedLT * (config[0] / 100)),
      hc = Math.round(ac.cap * parsedHT * (config[1] / 100));
    profit = Basics.cargo.profit.specific(
      ac,
      mode,
      route.dist,
      lc,
      hc,
      fp,
      cp,
      rep,
      flpd,
      false
    );
    if (route.dist > ac.range) {
      stopover = Basics.airports.stopover(dep, arr, ac.range, ac.rwy);
    } else stopover = false;
    demand = [route.l, route.h];
    if (!config[2]) UI.alertBox(S.err.no_dem, "#fa3737");
    $("#ans-lp").text("$" + tickets[0]);
    $("#ans-hp").text("$" + tickets[1]);
    $("#ans-ll").text(config[0] + "%");
    $("#ans-hl").text(config[1] + "%");
    $("#ans-pf").text("$" + Func.cn(profit[0]));
    $("#ans-pd").text("$" + Func.cn(profit[1]));
    $("#ans-ph1").text("Profit/Flight");
    $("#ans-ph2").text("Profit/Day");
    if (stopover && Func.error.check(stopover, "ERR_DESTINATION_UNREACHABLE")) {
      $("#execute")
        .removeClass("loading-animation")
        .html("<i class='fa fa-search'></i> Calculate!");
      return UI.alertBox(S.err.unreachable);
    }
    if (!stopover) {
      $("#ans-t-4").hide();
    } else {
      $("#ans-t-4").show();
      $("#ans-table-box-inner-box-4 table").empty()
        .append(`<h4><span id="ans-name"></span><br><span id="ans-icia"></span></h4>
            <table style="width: 90%; max-width: 175px; margin: auto">
                <tr><td style="text-align: left"><i class="fa fa-plus"></i></td><td style="text-align: right" id="ans-exd"></td></tr>
                <tr><td style="text-align: left"><i class="extended-glyphicons glyphicons glyphicons-vector-path-curve"></i></td><td style="text-align: right" id="ans-totd"></td></tr>
            </table>`);
      $("#ans-name").text(`${stopover[0].n}, ${stopover[0].c}`);
      $("#ans-icia").text(`${stopover[0].ia} | ${stopover[0].ic}`);
      $("#ans-exd").text("+ " + stopover[0].extdist + " km");
      $("#ans-totd").text(stopover[0].dist + " km");
      // $("#ans-ph3").text("Add. Distance")
      // $("#ans-ph4").text("Total Distance")
    }
    $("#result-title").html(
      `${dep.ic} <i class="fa fa-exchange-alt"></i> ${arr.ic}`
    );
    $("#tool-inp").hide();
    $("#tool-ans").show();
    $("#execute")
      .removeClass("loading-animation")
      .html("<i class='fa fa-search'></i> Calculate!");
  },
  stopover: () => {
    let dep = Func.data.get.airport($("#inp-dep").val());
    let arr = Func.data.get.airport($("#inp-arr").val());
    let range = $("#inp-range").val();
    let rwy = $("#inp-rwy").val();
    if (!dep) return UI.alertBox(S.err.vdep, "#fa3737");
    if (!arr) return UI.alertBox(S.err.varr, "#fa3737");
    if (!range) return UI.alertBox(S.err.range, "#fa3737");
    if (!rwy) rwy = 0;
    let res = Basics.airports.stopover(dep, arr, range, rwy);
    if (
      Func.error.check(res, "ERR_DEPARTURE_RUNWAY_TOO_SHORT") ||
      Func.error.check(res, "ERR_DESTINATION_RUNWAY_TOO_SHORT")
    ) {
      return UI.alertBox(S.err.rwy_short, "#fa3737");
    }
    if (Func.error.check(res, "ERR_DIRECT_FLIGHT")) {
      return UI.alertBox(S.err.direct_flight, "#fa3737");
    }
    if (Func.error.check(res, "ERR_DESTINATION_UNREACHABLE")) {
      return UI.alertBox(S.err.unreachable, "#fa3737");
    }
    $("#ans-name").text(`${res[0].n}, ${res[0].c}`);
    $("#ans-icia").text(`${res[0].ia} | ${res[0].ic}`);
    $("#ans-exd").text("+ " + res[0].extdist + " km");
    $("#ans-totd").text(res[0].dist + " km");
    // $("#ans-ph3").text("Extra Distance")
    // $("#ans-ph4").text("Total Distance")
    $("#tool-inp").hide();
    $("#tool-ans").show();
  },
  mfind: () => {
    let dep = Func.data.get.airport($("#inp-dep").val());
    let m = $("#inp-minm").val();
    let rwy = $("#inp-rwy").val();
    if (!dep) return UI.alertBox(S.err.vdep, "#fa3737");
    if (!rwy) rwy = 0;
    let res = Basics.airports.mfind(dep, m, rwy);
    if (Func.error.check(res, "ERR_NO_RESULT")) {
      return UI.alertBox(S.err.no_result, "#fa3737");
    }
    $("#ans-nameicia").html(
      `${res[0].n}, ${res[0].c}<br>${res[0].ia} | ${res[0].ic}`
    );
    $("#ans-dist").text(Math.round(res[0].dist) + " km");
    $("#ans-pct").text(res[0].m + "%");
    $("#ans-rwy").text(res[0].r + " ft");
    $("#tool-inp").hide();
    $("#tool-ans").show();
  },
  resell: () => {
    let res = Basics.planes.resell(
      Func.data.get.plane($("#inp-ac").val()),
      $("#inp-mkt").val(),
      $("#inp-js").val(),
      $("#inp-fs").val(),
      $("#inp-fh").val()
    );
    if (res[0]) {
      $("#ans-v").text("$" + Func.cn(res[0]));
      $("#tool-inp").hide();
      $("#tool-ans").show();
    }
  },
  estimate: async () => {
    $("#execute")
      .addClass("loading-animation")
      .html(
        "<i class='extended-glyphicons glyphicons glyphicons-refresh'></i>"
      );
    let ac = Func.data.get.plane($("#inp-ac").val());
    let dep = Func.data.get.airport($("#inp-dep").val());
    let arr = Func.data.get.airport($("#inp-arr").val());
    let fh = $("#inp-fh").val();
    let fp = $("#inp-fp").val();
    let cp = $("#inp-cp").val();
    let rep = $("#inp-rep").val();
    let mode = UI.switch("inp-mode-1");
    let sm = UI.switch("inp-sm-1");
    let fm = UI.switch("inp-fm-1");
    let qm = UI.switch("inp-qm-1");
    ac = Func.mod(ac, sm, fm, qm);
    if (!ac) {
      ac = Func.data.get.cargo($("#inp-ac").val());
      if (!ac) return UI.alertBox(S.err.vac, "#fa3737");
      if (mode) ac.mC = ac.mC * 2;
    } else if (!mode) ac.mC = ac.mC / 2;
    if (!dep) {
      $("#execute")
        .removeClass("loading-animation")
        .html("<i class='fa fa-search'></i> Calculate!");
      return UI.alertBox(S.err.vdep, "#fa3737");
    }
    if (!arr) {
      $("#execute")
        .removeClass("loading-animation")
        .html("<i class='fa fa-search'></i> Calculate!");
      return UI.alertBox(S.err.varr, "#fa3737");
    }
    if (!fh) {
      $("#execute")
        .removeClass("loading-animation")
        .html("<i class='fa fa-search'></i> Calculate!");
      return UI.alertBox(S.err.inps, "#fa3737");
    }
    if (!fp) fp = 600;
    if (!cp) cp = 120;
    if (!rep) rep = 90;
    if (rep < 11)
      UI.alertBox("Reputation must be greater than 10%!", "#fa3737");
    let route = await Func.api.route(dep.ic, arr.ic);
    let res = Basics.planes.estimation(
      dep,
      arr,
      ac,
      fh,
      route,
      mode,
      fp,
      cp,
      rep
    );
    // $("#ans-ph1").text("Estimated Profit")
    $("#ans-title-bold")[0].parentElement.colSpan = "3";
    $("#ans-ph2").text("Fuel");
    $("#ans-ph3").text("Quotas");
    $("#ans-ph4").text("Maint.");
    $("#ans-prf").text("$" + Func.cn(Math.round(res[0][0] * res[1])));
    $("#ans-f").text(Func.cn(Math.round(res[0][2] * res[1])) + " lbs");
    $("#ans-q").text(Func.cn(Math.round(res[0][4] * res[1])));
    $("#ans-m").text("$" + Func.cn(Math.round(res[0][6] * res[1])));
    $("#result-title").html(
      `${dep.ic} <i class="fa fa-exchange-alt"></i> ${arr.ic}`
    );
    $("#tool-inp").hide();
    $("#tool-ans").show();
    $("#execute")
      .removeClass("loading-animation")
      .html("<i class='fa fa-search'></i> Calculate!");
  },
  fleet: () => {
    $("#plane-result-box").empty();
    let names = $(".plane-added-name");
    let amounts = $(".plane-added-amount");
    let i = 0,
      profit,
      easyplane,
      realplane,
      total = [0, 0];
    if (names.length != amounts.length)
      return UI.alertBox(S.err.admin_contact, "#fa3737");
    while (i < names.length) {
      easyplane = Func.data.get.paxcargo(names[i].innerHTML);
      realplane = Func.data.get.paxcargo(names[i].innerHTML);
      if (easyplane.cap > 700) realplane.mC = realplane.mC * 2;
      if (easyplane.cap < 700) easyplane.mC = easyplane.mC / 2;
      profit = [
        Basics.pax.profit.general(realplane, true),
        Basics.pax.profit.general(easyplane, false),
      ];
      if (!isNaN(profit[0]) && !isNaN(profit[1])) {
        total[0] += profit[0] * amounts[i].innerHTML;
        total[1] += profit[1] * amounts[i].innerHTML;
      }
      $("#plane-result-box").append(`
            <div class='plane-added' onclick="UI.actab.open('${easyplane.n}')">
                <div class='plane-added-1'>
                    <img src='assets@V2.1/images/ac/${
                      easyplane.pc
                    }.png' class='plane-added-1-img'>
                </div>
                <p class='plane-added-2'>
                    <b>
                        <span class='plane-added-name'>${easyplane.n}</span><br>
                        <span class='plane-added-amount'>x ${
                          amounts[i].innerHTML
                        }</span>
                    </b><br>
                    <span class='i-col-real'>${S.general.realism} $${Func.cn(
        profit[0] * amounts[i].innerHTML
      )}</span><br>
                    <span class='i-col-easy'>${S.general.easy} $${Func.cn(
        profit[1] * amounts[i].innerHTML
      )}
                </p>
            </div>`);
      i++;
    }
    $("#total-profit-realism").text(`$${Func.cn(total[0])}`);
    $("#total-profit-easy").text(`$${Func.cn(total[1])}`);
    $("#tool-inp").hide();
    $("#tool-ans").show();
  },
  acs: () => {
    $("#tool-ans")
      .empty()
      .append(`${UI.create.returnButton()}<h4 id="result-title"></h4>`);
    let speed = $("#inp-speed").val();
    let cap = $("#inp-cap").val();
    let fuel = $("#inp-fuel").val();
    let co2 = $("#inp-co2").val();
    let range = $("#inp-range").val();
    let rwy = $("#inp-rwy").val();
    let cost = $("#inp-cost").val();
    if (!speed) speed = "-";
    if (!cap) cap = "-";
    if (!fuel) fuel = "-";
    if (!co2) co2 = "-";
    if (!range) range = "-";
    if (!rwy) rwy = "-";
    if (!cost) cost = "-";
    if (
      speed == cap &&
      speed == fuel &&
      speed == co2 &&
      speed == range &&
      speed == rwy &&
      speed == cost &&
      speed == "-"
    )
      return UI.alertBox(S.acs.one_filter, "#fa3737");
    let res = Basics.planes.search(speed, cap, cost, range, rwy, fuel, co2);
    if (!res) return UI.alertBox(S.err.no_result, "#fa3737");
    let i = 0;
    while (i < res.length) {
      $("#tool-ans").append(`
            <div class="acs-content" onclick="UI.actab.open('${
              res[i][4]
            }')" data-plane="${res[i][4]}" style="cursor: pointer">
                <div class="acs-image-smallscreen-box">
                    <img src="assets@V2.1/images/ac/${
                      res[i][5]
                    }.png" class="acs-image-smallscreen">
                </div>
                <div class="acs-image-normal-box">
                    <img src="assets@V2.1/images/ac/${
                      res[i][5]
                    }.png" class="acs-image-normal">
                </div>
                <div class="acs-maininfo-outer">
                    <div class="acs-maininfo-inner">
                        <div class="acs-col-data">
                            <b>${res[i][4]}</b><br>
                            <span class="acs-text">${res[i][3]} km / ${
        res[i][1]
      } kph / ${res[i][2]} pax / ${res[i][6]} lbs/km</span>
                        </div>
                        <div class="acs-col-cost">
                            <b>Cost</b><br>
                            <b class="acs-price">$${Func.cn(res[i][0])}</b>
                        </div>
                    </div>
                </div>
            </div>
            `);
      i++;
    }
    $("#result-title").text(`RESULTS: ${res.length}`);
    $("#tool-inp").hide();
    $("#tool-ans").show();
  },
  research: async () => {
    $("#execute")
      .addClass("loading-animation")
      .html(
        "<i class='extended-glyphicons glyphicons glyphicons-refresh'></i>"
      );
    function getTable(i) {
      if (ac.cap < 700)
        return `${UI.create.table(
          ["<i class='fa fa-ticket-alt i-col-cred'></i>", "Tickets"],
          [Func.img.y, Func.img.j, Func.img.f_low],
          [`ans-yp-${i}`, `ans-jp-${i}`, `ans-fp-${i}`],
          `ans-t-1-${i}`,
          `1-${i}`
        )}
            ${UI.create.table(
              ["<i class='fa fa-couch i-col-0c0'></i>", "Configuration"],
              [Func.img.y, Func.img.j, Func.img.f_low],
              [`ans-ys-${i}`, `ans-js-${i}`, `ans-fs-${i}`],
              `ans-t-2-${i}`,
              `2-${i}`
            )}
            ${UI.create.table(
              [
                "<i class='extended-glyphicons glyphicons glyphicons-usd i-col-dol'></i>",
                "Profit",
              ],
              [
                '<i class="extended-glyphicons glyphicons glyphicons-usd i-col-dol"></i>',
                '<i class="extended-glyphicons glyphicons glyphicons-usd i-col-dol"></i>',
                '<i class="extended-glyphicons glyphicons glyphicons-usd i-col-dol"></i>',
                '<i class="extended-glyphicons glyphicons glyphicons-usd i-col-dol"></i>',
              ],
              [`ans-ph1-${i}`, `ans-pf-${i}`, `ans-ph2-${i}`, `ans-pd-${i}`],
              `ans-t-3-${i}`,
              `3-${i}`
            )}
            ${UI.create.table(
              ["<i class='fa fa-plane-arrival i-col-107'></i>", "Stopover"],
              [
                '<i class="fa fa-plane-arrival i-col-999"></i>',
                '<i class="fa fa-plane-arrival i-col-999"></i>',
                '<i class="fa fa-plus-square i-col-107"></i>',
                '<i class="fa fa-plus-square i-col-107"></i>',
                '<i class="fa fa-globe i-col-107"></i>',
                '<i class="fa fa-globe i-col-107"></i>',
              ],
              [
                `ans-name-${i}`,
                `ans-icia-${i}`,
                `ans-ph3-${i}`,
                `ans-exd-${i}`,
                `ans-ph4-${i}`,
                `ans-totd-${i}`,
              ],
              `ans-t-4-${i}`,
              `4-${i}`
            )}`;
      if (ac.cap > 700)
        return `${UI.create.table(
          ["<i class='fa fa-ticket-alt i-col-cred'></i>", "Tickets"],
          [Func.img.l, Func.img.h],
          [`ans-lp-${i}`, `ans-hp-${i}`],
          `ans-t-1-${i}`,
          `1-${i}`
        )}
            ${UI.create.table(
              ["<i class='fa fa-couch i-col-0c0'>", "Configuration"],
              [Func.img.l, Func.img.h],
              [`ans-ll-${i}`, `ans-hl-${i}`],
              `ans-t-2-${i}`,
              `2-${i}`
            )}
            ${UI.create.table(
              [
                "<i class='extended-glyphicons glyphicons glyphicons-usd i-col-dol'></i>",
                "Profit",
              ],
              [
                '<i class="extended-glyphicons glyphicons glyphicons-usd i-col-dol"></i>',
                '<i class="extended-glyphicons glyphicons glyphicons-usd i-col-dol"></i>',
                '<i class="extended-glyphicons glyphicons glyphicons-usd i-col-dol"></i>',
                '<i class="extended-glyphicons glyphicons glyphicons-usd i-col-dol"></i>',
              ],
              [`ans-ph1-${i}`, `ans-pf-${i}`, `ans-ph2-${i}`, `ans-pd-${i}`],
              `ans-t-3-${i}`,
              `3-${i}`
            )}
            ${UI.create.table(
              ["<i class='fa fa-plane-arrival i-col-107'></i>", "Stopover"],
              [
                '<i class="fa fa-plane-arrival i-col-999"></i>',
                '<i class="fa fa-plane-arrival i-col-999"></i>',
                '<i class="fa fa-plus-square i-col-107"></i>',
                '<i class="fa fa-plus-square i-col-107"></i>',
                '<i class="fa fa-globe i-col-107"></i>',
                '<i class="fa fa-globe i-col-107"></i>',
              ],
              [
                `ans-name-${i}`,
                `ans-icia-${i}`,
                `ans-ph3-${i}`,
                `ans-exd-${i}`,
                `ans-ph4-${i}`,
                `ans-totd-${i}`,
              ],
              `ans-t-4-${i}`,
              `4-${i}`
            )}`;
    }
    $("#rsc-box").empty();
    let dep = Func.data.get.airport($("#inp-dep").val());
    let ac = Func.data.get.paxcargo($("#inp-ac").val());
    let dist = $("#inp-dist").val();
    let rwy = ac.rwy;
    let mode = UI.switch("inp-mode-1");
    let sm = UI.switch("inp-sm-1");
    let filterByTotal = UI.switch("inp-filter-1");
    ac = Func.mod(ac, sm, false, false);
    if (!dist) {
      $("#execute")
        .removeClass("loading-animation")
        .html("<i class='fa fa-search'></i> Search!");
      return UI.alertBox(S.err.inps, "#fa3737");
    }
    if (dist < 500) {
      $("#execute")
        .removeClass("loading-animation")
        .html("<i class='fa fa-search'></i> Search!");
      return UI.alertBox(S.err.dist_min_500, "#fa3737");
    }
    if (dist > ac.range * 2) {
      $("#execute")
        .removeClass("loading-animation")
        .html("<i class='fa fa-search'></i> Search!");
      return UI.alertBox(S.err.no_possible_result, "#fa3737");
    }
    if (rwy > 16000) rwy = 0;
    if (!mode) {
      if (ac.cap < 700) {
        ac.mC = ac.mC / 2;
      }
      ac.speed = Math.round(ac.speed * 1.5);
      ac.rwy = 0;
    } else {
      if (ac.cap > 700) {
        ac.mC = ac.mC * 2;
      }
    }
    if (dep.r < ac.rwy) {
      $("#execute")
        .removeClass("loading-animation")
        .html("<i class='fa fa-search'></i> Search!");
      return UI.alertBox(S.err.dep_rwy_short, "#fa3737");
    }
    let data = await Func.api.research(dep.ic, rwy, dist);
    if (!data[0]) {
      $("#execute")
        .removeClass("loading-animation")
        .html("<i class='fa fa-search'></i> Search!");
      return UI.alertBox(S.err.no_result, "#fa3737");
    }
    data = data[0];
    let totalDemandArray = [];
    for (let e of data.route) {
      if (ac.cap < 700) {
        if (filterByTotal)
          totalDemandArray.push([
            e.economy_class_demand +
              e.business_class_demand * 2 +
              e.first_class_demand * 3,
            e.iata,
            e.economy_class_demand,
            e.business_class_demand,
            e.first_class_demand,
            e.cargo_large_demand,
            e.cargo_heavy_demand,
          ]);
        else
          totalDemandArray.push([
            e.first_class_demand * 3,
            e.iata,
            e.economy_class_demand,
            e.business_class_demand,
            e.first_class_demand,
            e.cargo_large_demand,
            e.cargo_heavy_demand,
          ]);
      } else {
        if (filterByTotal)
          totalDemandArray.push([
            e.cargo_large_demand * 1.428 + e.cargo_heavy_demand,
            e.iata,
            e.economy_class_demand,
            e.business_class_demand,
            e.first_class_demand,
            e.cargo_large_demand,
            e.cargo_heavy_demand,
          ]);
        else
          totalDemandArray.push([
            e.cargo_large_demand,
            e.iata,
            e.economy_class_demand,
            e.business_class_demand,
            e.first_class_demand,
            e.cargo_large_demand,
            e.cargo_heavy_demand,
          ]);
      }
    }
    totalDemandArray.sort(function (a, b) {
      return b[0] - a[0];
    });
    let i = 0,
      airportObject,
      specificData,
      fl = $("#inp-fl").val(),
      routeDistance;
    console.log(totalDemandedArray);
    while (i < totalDemandArray.length) {
      fl = $("#inp-fl").val();
      airportObject = Func.data.get.airport(totalDemandArray[i][1]);
      routeDistance = Func.distance(
        airportObject.lat,
        airportObject.lon,
        dep.lat,
        dep.lon
      );
      if (!fl || fl > Func.flpd(ac.speed, routeDistance))
        fl = Func.flpd(ac.speed, routeDistance);
      specificData = Tools.detailedRoute(
        totalDemandArray[i][2],
        totalDemandArray[i][3],
        totalDemandArray[i][4],
        totalDemandArray[i][5] * 1000,
        totalDemandArray[i][6] * 1000,
        routeDistance,
        ac,
        mode,
        dep,
        airportObject,
        fl
      );
      $("#rsc-box").append(`
            <div class='rcs-entry' id="rcs-entry-${i}">
                <span><b>${airportObject.n}, ${airportObject.c}<br>
                    <span id="rcs-result-${i + 1}">${
        airportObject.ia
      }</span> | ${airportObject.ic}</b>
                </span><br><br>
                <span style="line-height: 2"><i class="fa fa-globe i-col-107"></i> ${Func.cn(
                  Math.round(
                    Func.distance(
                      airportObject.lat,
                      airportObject.lon,
                      dep.lat,
                      dep.lon
                    )
                  )
                )} km</span><br>
                <span style="line-height: 2"><i class="fa fa-plane i-col-888"></i> ${fl} Flights</span><br>
                <span style="line-height: 2">${Func.img.y} ${
        totalDemandArray[i][2]
      }<div style="margin-left: 8px; display: inline-block">${Func.img.j} ${
        totalDemandArray[i][3]
      }</div><div style="margin-left: 8px; display: inline-block">${
        Func.img.f_low
      } ${totalDemandArray[i][4]}</div></span><br>
                <span style="line-height: 2">${Func.img.l} ${Func.cn(
        totalDemandArray[i][5] * 1000
      )}<div style="margin-left: 8px; display: inline-block">${
        Func.img.h
      } ${Func.cn(totalDemandArray[i][6] * 1000)}</div></span>
            </div>
            <div class='rcs-details'>
                ${getTable(i)}
            </div>
            <button class='rcs-showmore' onclick='$(this).prev().slideToggle()'><i class='fa fa-caret-down'></i></button>`);
      if (ac.cap < 700) {
        $(`#ans-yp-${i}`).text("$" + specificData[0][0]);
        $(`#ans-jp-${i}`).text("$" + specificData[0][1]);
        $(`#ans-fp-${i}`).text("$" + specificData[0][2]);
        $(`#ans-ys-${i}`).text("x " + specificData[1][0]);
        $(`#ans-js-${i}`).text("x " + specificData[1][1]);
        $(`#ans-fs-${i}`).text("x " + specificData[1][2]);
        $(`#ans-pf-${i}`).text("$" + Func.cn(specificData[2][0]));
        $(`#ans-pd-${i}`).text("$" + Func.cn(specificData[2][1]));
        $(`#ans-ph1-${i}`).text("Profit/Flight");
        $(`#ans-ph2-${i}`).text("Profit/Day");
        if (Func.error.check(specificData[3], "ERR_DESTINATION_UNREACHABLE")) {
          $(`#rcs-entry-${i}`).hide();
          $(`#rcs-entry-${i}`).next().hide();
          $(`#rcs-entry-${i}`).next().next().hide();
        }
        if (!specificData[1][3]) {
          $(`#rcs-entry-${i}`).css({ backgroundColor: "rgba(255,0,0,.2)" });
        }
        if (Func.error.check(specificData[3], "ERR_DIRECT_FLIGHT")) {
          $(`#ans-t-4-${i}`).hide();
        } else {
          $(`#ans-t-4-${i}`).show();
          $(`#ans-table-box-inner-box-4-${i} table`).empty()
            .append(`<h4><span id="ans-name-${i}"></span><br><span id="ans-icia-${i}"></span></h4>
                    <table style="width: 90%; max-width: 175px; margin: auto">
                        <tr><td style="text-align: left"><i class="fa fa-plus"></i></td><td style="text-align: right" id="ans-exd-${i}"></td></tr>
                        <tr><td style="text-align: left"><i class="extended-glyphicons glyphicons glyphicons-vector-path-curve"></i></td><td style="text-align: right" id="ans-totd-${i}"></td></tr>
                    </table>`);
          $(`#ans-name-${i}`).text(
            `${specificData[3][0].n}, ${specificData[3][0].c}`
          );
          $(`#ans-icia-${i}`).text(
            `${specificData[3][0].ia} | ${specificData[3][0].ic}`
          );
          $(`#ans-exd-${i}`).text("+ " + specificData[3][0].extdist + " km");
          $(`#ans-totd-${i}`).text(specificData[3][0].dist + " km");
          // $(`#ans-ph3-${i}`).text("Add. Distance")
          // $(`#ans-ph4-${i}`).text("Total Distance")
        }
      } else {
        $(`#ans-lp-${i}`).text("$" + specificData[0][0]);
        $(`#ans-hp-${i}`).text("$" + specificData[0][1]);
        $(`#ans-ll-${i}`).text(specificData[1][0] + "%");
        $(`#ans-hl-${i}`).text(specificData[1][1] + "%");
        $(`#ans-pf-${i}`).text("$" + Func.cn(specificData[2][0]));
        $(`#ans-pd-${i}`).text("$" + Func.cn(specificData[2][1]));
        $(`#ans-ph1-${i}`).text("Profit/Flight");
        $(`#ans-ph2-${i}`).text("Profit/Day");
        if (Func.error.check(specificData[3], "ERR_DESTINATION_UNREACHABLE")) {
          $(`#rcs-entry-${i}`).hide();
          $(`#rcs-entry-${i}`).next().hide();
          $(`#rcs-entry-${i}`).next().next().hide();
        }
        if (!specificData[1][2]) {
          $(`#rcs-entry-${i}`).css({ backgroundColor: "rgba(255,0,0,.2)" });
        }
        if (Func.error.check(specificData[3], "ERR_DIRECT_FLIGHT")) {
          $(`#ans-t-4-${i}`).hide();
        } else {
          $(`#ans-t-4-${i}`).show();
          $(`#ans-table-box-inner-box-4-${i} table`).empty()
            .append(`<h4><span id="ans-name-${i}"></span><br><span id="ans-icia-${i}"></span></h4>
                    <table style="width: 90%; max-width: 175px; margin: auto">
                        <tr><td style="text-align: left"><i class="fa fa-plus"></i></td><td style="text-align: right" id="ans-exd-${i}"></td></tr>
                        <tr><td style="text-align: left"><i class="extended-glyphicons glyphicons glyphicons-vector-path-curve"></i></td><td style="text-align: right" id="ans-totd-${i}"></td></tr>
                    </table>`);
          $(`#ans-name-${i}`).text(
            `${specificData[3][0].n}, ${specificData[3][0].c}`
          );
          $(`#ans-icia-${i}`).text(
            `${specificData[3][0].ia} | ${specificData[3][0].ic}`
          );
          $(`#ans-exd-${i}`).text("+ " + specificData[3][0].extdist + " km");
          $(`#ans-totd-${i}`).text(specificData[3][0].dist + " km");
          // $(`#ans-ph3-${i}`).text("Add. Distance")
          // $(`#ans-ph4-${i}`).text("Total Distance")
        }
      }
      i++;
    }
    $("#tool-inp").hide();
    $("#tool-ans").show();
    $("#execute")
      .removeClass("loading-animation")
      .html("<i class='fa fa-search'></i> Search!");
  },
  detailedRoute: (
    yDem,
    jDem,
    fDem,
    lDem,
    hDem,
    dist,
    plane,
    mode,
    dep,
    arr,
    flightsDay
  ) => {
    if (plane.cap < 700) {
      let tickets;
      if (mode)
        tickets = [
          Basics.pax.ticket.realY(dist - 1.5),
          Basics.pax.ticket.realJ(dist - 1.5),
          Basics.pax.ticket.realF(dist - 1.5),
        ];
      else
        tickets = [
          Basics.pax.ticket.easyY(dist - 1.5),
          Basics.pax.ticket.easyJ(dist - 1.5),
          Basics.pax.ticket.easyF(dist - 1.5),
        ];
      let config = Basics.pax.config(
        plane.cap,
        dist,
        flightsDay,
        yDem,
        jDem,
        fDem,
        mode,
        true
      );
      let profit = Basics.pax.profit.specific(
        plane,
        mode,
        dist,
        config[0],
        config[1],
        config[2],
        600,
        120,
        90,
        flightsDay,
        false
      );
      let stopover = Basics.airports.stopover(dep, arr, plane.range, plane.rwy);
      return [tickets, config, profit, stopover];
    } else {
      let tickets;
      if (mode)
        tickets = [
          Basics.cargo.ticket.realLarge(dist - 1.5),
          Basics.cargo.ticket.realHeavy(dist - 1.5),
        ];
      else
        tickets = [
          Basics.cargo.ticket.easyLarge(dist - 1.5),
          Basics.cargo.ticket.easyHeavy(dist - 1.5),
        ];
      let config = Basics.cargo.config(
        plane.cap,
        lDem,
        hDem,
        flightsDay,
        3,
        3,
        true
      );
      let lc = Math.round(plane.cap * 0.7 * 1.03 * (config[0] / 100)),
        hc = Math.round(plane.cap * 1.03 * (config[1] / 100));
      let profit = Basics.cargo.profit.specific(
        plane,
        mode,
        dist,
        lc,
        hc,
        600,
        120,
        90,
        flightsDay,
        false
      );
      let stopover = Basics.airports.stopover(dep, arr, plane.range, plane.rwy);
      return [tickets, config, profit, stopover];
    }
  },
  compac: async () => {
    $(".based-on-8h").hide();
    let ac1 = Func.data.get.paxcargo($("#inp-ac-1").val());
    let ac2 = Func.data.get.paxcargo($("#inp-ac-2").val());
    let mode = UI.switch("inp-mode-1");
    if (!ac1 || !ac2) return UI.alertBox(S.err.vac2, "#fa3737");
    if (!mode) {
      if (ac1.cap < 700) {
        ac1.mC = Math.round(ac1.mC / 2);
      }
      if (ac2.cap < 700) {
        ac2.mC = Math.round(ac2.mC / 2);
      }
    } else {
      if (ac1.cap > 700) {
        ac1.mC = ac1.mC * 2;
      }
      if (ac2.cap > 700) {
        ac2.mC = ac2.mC * 2;
      }
    }
    let res = Basics.planes.compare.pax(ac1, ac2, mode);
    if (ac1.n.toLowerCase() == ac2.n.toLowerCase())
      return UI.alertBox(S.err.two_different_planes, "#fa3737");
    if (Func.error.check(res, "ERR_MIXED_TYPES"))
      return UI.alertBox(S.err.mixed_types, "#fa3737");
    if (Func.error.check(res, "ERR_USE_CARGOCOMPARE"))
      res = Basics.planes.compare.cargo(ac1, ac2, mode);
    let profit = res[0][0];
    let stats = res[0][1];
    let orig = res[0][2];
    $("#ans-sec1-table").css({ maxWidth: "400px", whiteSpace: "nowrap" });
    $("#ans-sec2-table").css({ maxWidth: "400px", whiteSpace: "nowrap" });
    $("#ans-label-1").html(
      "<i class='extended-glyphicons glyphicons glyphicons-usd i-col-dol'></i> " +
        S.ans.daily_p
    );
    $("#ans-label-2").html(
      "<i class='extended-glyphicons glyphicons glyphicons-tint'></i> " +
        S.ans.f
    );
    $("#ans-label-3").html(
      "<i class='extended-glyphicons glyphicons glyphicons-leaf i-col-0f0'></i> " +
        S.ans.c
    );
    $("#ans-label-4").html(
      "<i class='extended-glyphicons glyphicons glyphicons-wrench i-col-777'></i> " +
        S.ans.m
    );
    $("#ans-label-5").html(
      "<i class='extended-glyphicons glyphicons glyphicons-plane i-col-777'></i> " +
        S.st.speed
    );
    $("#ans-label-6").html(
      "<i class='extended-glyphicons glyphicons glyphicons-user'></i> " +
        S.st.cap
    );
    $("#ans-label-7").html(
      "<i class='extended-glyphicons glyphicons glyphicons-tint'></i> " + S.st.f
    );
    $("#ans-label-8").html(
      "<i class='extended-glyphicons glyphicons glyphicons-leaf i-col-0f0'></i> " +
        S.st.c
    );
    $("#ans-label-9").html(
      "<i class='extended-glyphicons glyphicons glyphicons-wrench i-col-777'></i> " +
        S.st.mc
    );
    $("#ans-label-10").html(
      "<i class='extended-glyphicons glyphicons glyphicons-clock i-col-aaa'></i> " +
        S.st.mh
    );
    $("#ans-label-11").html(
      "<i class='extended-glyphicons glyphicons glyphicons-vector-path-curve i-col-888'></i> " +
        S.st.r
    );
    $("#ans-label-12").html(
      "<i class='extended-glyphicons glyphicons glyphicons-road i-col-777'></i> " +
        S.st.rwy
    );
    $("#ans-label-13").html(
      "<i class='extended-glyphicons glyphicons glyphicons-usd i-col-dol'></i> " +
        S.st.p
    );
    $("#ans-label-5").parent().siblings().remove();
    $("#ans-label-6").parent().siblings().remove();
    $("#ans-label-7").parent().siblings().remove();
    $("#ans-label-8").parent().siblings().remove();
    $("#ans-label-9").parent().siblings().remove();
    $("#ans-label-10").parent().siblings().remove();
    $("#ans-label-11").parent().siblings().remove();
    $("#ans-label-12").parent().siblings().remove();
    $("#ans-label-13").parent().siblings().remove();
    $("#ans-label-1")
      .parent()
      .parent()
      .parent()
      .prepend(
        "<tr class='based-on-8h'><th colspan='3' style='text-align: left; font-style: italic'><i class='fa fa-info-circle' style='color: #17a2b8'></i> Based on a perfect 8h route</th></tr>"
      );
    $(".ans-td-1").attr("colspan", 3);
    $("#ans-table-box-inner-box-1").css({ minWidth: "200px" });
    $("#ans-table-box-inner-box-2").css({ minWidth: "200px" });
    $("#ans-table-box-inner-1").css({ overflowX: "scroll" });
    $("#ans-table-box-inner-2").css({ overflowX: "scroll" });
    $(".ans-plane-1").html(`<i>${ac1.n}</i>`);
    $(".ans-plane-2").html(`<i>${ac2.n}</i>`);
    $("#ans-sec1-prf-org").text("$" + Func.cn(orig.ppd[0]));
    $("#ans-sec1-prf-dif")
      .text(Func.addDollar(profit.ppd))
      .css({ color: Func.compGetColor(profit.ppd, true) });
    $("#ans-sec1-fuel-org").text("$" + Func.cn(orig.fx[0] * 3));
    $("#ans-sec1-fuel-dif")
      .text(Func.addDollar(profit.fx))
      .css({ color: Func.compGetColor(profit.fx, false) });
    $("#ans-sec1-co2-org").text("$" + Func.cn(orig.cx[0] * 3));
    $("#ans-sec1-co2-dif")
      .text(Func.addDollar(profit.cx))
      .css({ color: Func.compGetColor(profit.cx, false) });
    $("#ans-sec1-mt-org").text("$" + Func.cn(orig.mx[0] * 3));
    $("#ans-sec1-mt-dif")
      .text(Func.addDollar(profit.mx))
      .css({ color: Func.compGetColor(profit.mx, false) });
    $("#ans-sec2-speed-org").text(Func.cn(ac1.speed) + " kph");
    $("#ans-sec2-speed-dif")
      .text(Func.cn(stats.speed) + " kph")
      .css({ color: Func.compGetColor(stats.speed, true) });
    $("#ans-sec2-cap-org").text(Func.cn(ac1.cap));
    $("#ans-sec2-cap-dif")
      .text(Func.cn(stats.cap))
      .css({ color: Func.compGetColor(stats.cap, true) });
    $("#ans-sec2-fuel-org").text(ac1.fConsmp + " lbs/km");
    $("#ans-sec2-fuel-dif")
      .text(stats.fConsmp + " lbs/km")
      .css({ color: Func.compGetColor2(stats.fConsmp, false) });
    $("#ans-sec2-co2-org").text(ac1.cConsmp + Func.getCargoUnit(ac1.cap));
    $("#ans-sec2-co2-dif")
      .text(stats.cConsmp + Func.getCargoUnit(ac1.cap))
      .css({ color: Func.compGetColor2(stats.cConsmp, false) });
    $("#ans-sec2-mc-org").text("$" + Func.cn(ac1.mC));
    $("#ans-sec2-mc-dif")
      .text(Func.addDollar(stats.mC))
      .css({ color: Func.compGetColor(stats.mC, false) });
    $("#ans-sec2-mh-org").text(ac1.mH);
    $("#ans-sec2-mh-dif")
      .text(stats.mH)
      .css({ color: Func.compGetColor(stats.mH, true) });
    $("#ans-sec2-range-org").text(ac1.range + " km");
    $("#ans-sec2-range-dif")
      .text(stats.range + " km")
      .css({ color: Func.compGetColor(stats.range, true) });
    $("#ans-sec2-rwy-org").text(ac1.rwy + " ft");
    $("#ans-sec2-rwy-dif")
      .text(stats.rwy + " ft")
      .css({ color: Func.compGetColor(stats.rwy, false) });
    $("#ans-sec2-cost-org").text("$" + Func.cn(ac1.price));
    $("#ans-sec2-cost-dif")
      .text(Func.addDollar(stats.price))
      .css({ color: Func.compGetColor(stats.price, false) });
    if (profit.ppd.includes("+"))
      $("#ans-rel-1").text(
        `${ac2.n}: ${Func.getRelation(orig.ppd[1], orig.ppd[0])}x ${
          S.other.more_profitable
        }`
      );
    else
      $("#ans-rel-1").text(
        `${ac1.n}: ${Func.getRelation(orig.ppd[0], orig.ppd[1])}x ${
          S.other.more_profitable
        }`
      );
    if (stats.price.includes("+"))
      $("#ans-rel-2").text(
        `${ac2.n}: ${Func.getRelation(ac2.price, ac1.price)}x ${
          S.other.more_expensive
        }`
      );
    else
      $("#ans-rel-2").text(
        `${ac1.n}: ${Func.getRelation(ac1.price, ac2.price)}x ${
          S.other.more_expensive
        }`
      );
    $("#tool-inp").hide();
    $("#tool-ans").show();
  },
  comprt: async () => {
    $("#execute")
      .addClass("loading-animation")
      .html(
        "<i class='extended-glyphicons glyphicons glyphicons-refresh'></i>"
      );
    let dep1 = Func.data.get.airport($("#inp-r1-dep").val());
    let arr1 = Func.data.get.airport($("#inp-r1-arr").val());
    let dep2 = Func.data.get.airport($("#inp-r2-dep").val());
    let arr2 = Func.data.get.airport($("#inp-r2-arr").val());
    let ac = Func.data.get.paxcargo($("#inp-ac").val());
    let mode = UI.switch("inp-mode-1");
    let sm = UI.switch("inp-sm-1");
    if (!dep1 || !arr1 || !dep2 || !arr2) {
      $("#execute")
        .removeClass("loading-animation")
        .html("<i class='fa fa-search'></i> Compare!");
      return UI.alertBox(S.err.apt, "#fa3737");
    }
    if (!ac) {
      $("#execute")
        .removeClass("loading-animation")
        .html("<i class='fa fa-search'></i> Compare!");
      return UI.alertBox(S.err.vac);
    }
    if (!mode) {
      if (ac.cap < 700) ac.mC = Math.round(ac.mC / 2);
      ac.rwy = 0;
      ac.speed = Math.round(ac.speed * 1.5);
    } else if (ac.cap > 700) ac.mC = ac.mC * 2;
    ac = Func.mod(ac, sm, false, false);
    let r1 = await Func.api.route(dep1.ic, arr1.ic);
    let r2 = await Func.api.route(dep2.ic, arr2.ic);
    let demand = [
      [r1.y, r1.j, r1.f, r1.l, r1.h],
      [r2.y, r2.j, r2.f, r2.l, r2.h],
    ];
    let flpd = [Func.flpd(ac.speed, r1.dist), Func.flpd(ac.speed, r2.dist)];
    let config, profit;
    if (ac.cap < 700) {
      config = [
        Basics.pax.config(
          ac.cap,
          r1.dist,
          flpd[0],
          r1.y,
          r1.j,
          r1.f,
          mode,
          true
        ),
        Basics.pax.config(
          ac.cap,
          r2.dist,
          flpd[1],
          r2.y,
          r2.j,
          r2.f,
          mode,
          true
        ),
      ];
      profit = [
        Basics.pax.profit.specific(
          ac,
          mode,
          r1.dist,
          config[0][0],
          config[0][1],
          config[0][2],
          600,
          120,
          90,
          flpd[0],
          false
        ),
        Basics.pax.profit.specific(
          ac,
          mode,
          r2.dist,
          config[1][0],
          config[1][1],
          config[1][2],
          600,
          120,
          90,
          flpd[1],
          false
        ),
      ];
    } else if (ac.cap > 700) {
      config = [
        Basics.cargo.config(ac.cap, r1.l, r1.h, flpd[0], 3, 3, true),
        Basics.cargo.config(ac.cap, r2.l, r2.h, flpd[1], 3, 3, true),
      ];
      let lc = [
        Math.round(ac.cap * 0.7 * 1.03 * (config[0][0] / 100)),
        Math.round(ac.cap * 0.7 * 1.03 * (config[1][0] / 100)),
      ];
      let hc = [
        Math.round(ac.cap * 1.03 * (config[0][1] / 100)),
        Math.round(ac.cap * 1.03 * (config[0][1] / 100)),
      ];
      profit = [
        Basics.cargo.profit.specific(
          ac,
          mode,
          r1.dist,
          lc[0],
          hc[0],
          600,
          120,
          90,
          flpd[0],
          false
        ),
        Basics.cargo.profit.specific(
          ac,
          mode,
          r2.dist,
          lc[1],
          hc[1],
          600,
          120,
          90,
          flpd[1],
          false
        ),
      ];
    }
    $("#ans-sec1-table").css({ maxWidth: "400px", whiteSpace: "nowrap" });
    $("#ans-sec2-table").css({ maxWidth: "400px", whiteSpace: "nowrap" });
    $("#ans-label-1").html(
      `<div class='ans-comp-space-div'>${Func.img.y}</div> ${S.cl.y}`
    );
    $("#ans-label-2").html(
      `<div class='ans-comp-space-div'>${Func.img.j}</div> ${S.cl.j}`
    );
    $("#ans-label-3").html(
      `<div class='ans-comp-space-div'>${Func.img.f_low}</div> ${S.cl.f}`
    );
    $("#ans-label-4").html(
      `<div class='ans-comp-space-div'>${Func.img.l}</div> ${S.cl.l}`
    );
    $("#ans-label-5").html(
      `<div class='ans-comp-space-div'>${Func.img.h}</div> ${S.cl.h}`
    );
    $("#ans-label-6").html(
      "<i class='extended-glyphicons glyphicons glyphicons-clock i-col-aaa'></i> " +
        S.inp.flpd
    );
    $("#ans-label-7").html(
      "<i class='extended-glyphicons glyphicons glyphicons-usd i-col-dol'></i> " +
        S.ans.prff
    );
    $("#ans-label-8").html(
      "<i class='extended-glyphicons glyphicons glyphicons-usd i-col-dol'></i> " +
        S.ans.prfd
    );
    $("#ans-label-9").html(
      `<div class='ans-comp-space-div'><i class='glyphicons glyphicons-vector-path-curve i-col-888'></i></div> ${S.general.distance}`
    );
    $("#ans-table-box-inner-box-1").css({ minWidth: "200px" });
    $("#ans-table-box-inner-box-2").css({ minWidth: "200px" });
    $("#ans-table-box-inner-1").css({ overflowX: "scroll" });
    $("#ans-table-box-inner-2").css({ overflowX: "scroll" });
    $(".ans-td-1").attr("colspan", 3);
    $("#ans-sec1-dist-org").html(Func.cn(r1.dist) + " km");
    $("#ans-sec1-dist-dif").html(Func.cn(r2.dist) + " km");
    $("#ans-sec1-yd-org")
      .text(Func.cn(demand[0][0]))
      .css({ color: demand[0][0] > demand[1][0] ? "#28a745" : "#dc3545" });
    $("#ans-sec1-yd-dif")
      .text(Func.cn(demand[1][0]))
      .css({ color: demand[0][0] > demand[1][0] ? "#dc3545" : "#28a745" });
    $("#ans-sec1-jd-org")
      .text(Func.cn(demand[0][1]))
      .css({ color: demand[0][1] > demand[1][1] ? "#28a745" : "#dc3545" });
    $("#ans-sec1-jd-dif")
      .text(Func.cn(demand[1][1]))
      .css({ color: demand[0][1] > demand[1][1] ? "#dc3545" : "#28a745" });
    $("#ans-sec1-fd-org")
      .text(Func.cn(demand[0][2]))
      .css({ color: demand[0][2] > demand[1][2] ? "#28a745" : "#dc3545" });
    $("#ans-sec1-fd-dif")
      .text(Func.cn(demand[1][2]))
      .css({ color: demand[0][2] > demand[1][2] ? "#dc3545" : "#28a745" });
    $("#ans-sec1-ld-org")
      .text(Func.cn(demand[0][3]))
      .css({ color: demand[0][3] > demand[1][3] ? "#28a745" : "#dc3545" });
    $("#ans-sec1-ld-dif")
      .text(Func.cn(demand[1][3]))
      .css({ color: demand[0][3] > demand[1][3] ? "#dc3545" : "#28a745" });
    $("#ans-sec1-hd-org")
      .text(Func.cn(demand[0][4]))
      .css({ color: demand[0][4] > demand[1][4] ? "#28a745" : "#dc3545" });
    $("#ans-sec1-hd-dif")
      .text(Func.cn(demand[1][4]))
      .css({ color: demand[0][4] > demand[1][4] ? "#dc3545" : "#28a745" });
    $("#ans-sec2-fl-org")
      .text(flpd[0])
      .css({ color: flpd[0] > flpd[1] ? "#28a745" : "#dc3545" });
    $("#ans-sec2-fl-dif")
      .text(flpd[1])
      .css({ color: flpd[0] > flpd[1] ? "#dc3545" : "#28a745" });
    $("#ans-sec2-pf-org")
      .text("$" + Func.cn(profit[0][0]))
      .css({ color: profit[0][0] > profit[1][0] ? "#28a745" : "#dc3545" });
    $("#ans-sec2-pf-dif")
      .text("$" + Func.cn(profit[1][0]))
      .css({ color: profit[0][0] > profit[1][0] ? "#dc3545" : "#28a745" });
    $("#ans-sec2-pd-org")
      .text("$" + Func.cn(profit[0][1]))
      .css({ color: profit[0][1] > profit[1][1] ? "#28a745" : "#dc3545" });
    $("#ans-sec2-pd-dif")
      .text("$" + Func.cn(profit[1][1]))
      .css({ color: profit[0][1] > profit[1][1] ? "#dc3545" : "#28a745" });
    if (demand[0][0] == demand[1][0]) {
      $("#ans-sec1-yd-org").css({ color: "#28a745" });
      $("#ans-sec1-yd-dif").css({ color: "#28a745" });
    }
    if (demand[0][1] == demand[1][1]) {
      $("#ans-sec1-jd-org").css({ color: "#28a745" });
      $("#ans-sec1-jd-dif").css({ color: "#28a745" });
    }
    if (demand[0][2] == demand[1][2]) {
      $("#ans-sec1-fd-org").css({ color: "#28a745" });
      $("#ans-sec1-fd-dif").css({ color: "#28a745" });
    }
    if (demand[0][3] == demand[1][3]) {
      $("#ans-sec1-ld-org").css({ color: "#28a745" });
      $("#ans-sec1-ld-dif").css({ color: "#28a745" });
    }
    if (demand[0][4] == demand[1][4]) {
      $("#ans-sec1-hd-org").css({ color: "#28a745" });
      $("#ans-sec1-hd-dif").css({ color: "#28a745" });
    }
    if (flpd[0] == flpd[1]) {
      $("#ans-sec2-fl-org").css({ color: "#28a745" });
      $("#ans-sec2-fl-dif").css({ color: "#28a745" });
    }
    if (profit[0][0] == profit[1][0]) {
      $("#ans-sec2-pf-org").css({ color: "#28a745" });
      $("#ans-sec2-pf-dif").css({ color: "#28a745" });
    }
    if (profit[0][1] == profit[1][1]) {
      $("#ans-sec2-pd-org").css({ color: "#28a745" });
      $("#ans-sec2-pd-dif").css({ color: "#28a745" });
    }
    $("#tool-inp").hide();
    $("#tool-ans").show();
    $("#execute")
      .removeClass("loading-animation")
      .html("<i class='fa fa-search'></i> Compare!");
  },
  ticket: () => {
    let mode = UI.switch("inp-gm-1");
    let dist = $("#inp-dist").val() - 1.5;
    if (mode) {
      $("#ans-yp").text(`$${Basics.pax.ticket.realY(dist)}`);
      $("#ans-jp").text(`$${Basics.pax.ticket.realJ(dist)}`);
      $("#ans-fp").text(`$${Basics.pax.ticket.realF(dist)}`);
      $("#ans-lp").text(`$${Basics.cargo.ticket.realLarge(dist)}`);
      $("#ans-hp").text(`$${Basics.cargo.ticket.realHeavy(dist)}`);
    } else {
      $("#ans-yp").text(`$${Basics.pax.ticket.easyY(dist)}`);
      $("#ans-jp").text(`$${Basics.pax.ticket.easyJ(dist)}`);
      $("#ans-fp").text(`$${Basics.pax.ticket.easyF(dist)}`);
      $("#ans-lp").text(`$${Basics.cargo.ticket.easyLarge(dist)}`);
      $("#ans-hp").text(`$${Basics.cargo.ticket.easyHeavy(dist)}`);
    }
    $("#result-title").text(`${$("#inp-dist").val()} KM`);
    $("#tool-inp").hide();
    $("#tool-ans").show();
  },
};
