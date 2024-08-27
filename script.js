window.addEventListener("DOMContentLoaded", () => {
    const clock = new ProgressClock("#clock");
});

class ProgressClock {
    constructor(qs) {
        this.el = document.querySelector(qs);
        this.time = 0;
        this.updateTimeut = null;
        this.ringTimeouts = [];
        this.update();
    }

    getDayOfWeek(day) {
        switch (day) {
            case 1:
                return "Segunda";
            case 2:
                return "Terça";
            case 3:
                return "Quarta";
            case 4:
                return "Quinta";
            case 5:
                return "Sexta";
            case 6:
                return "Sábado";
            default:
                return "Domingo";
        }
    }

    getMonthInfo(mo, yr) {
        switch (mo) {
            case 1:
                return { name: "Fevereiro", days: yr % 4 === 0 ? 29 : 28 };
            case 2:
                return { name: "Março", days: 31 };
            case 3:
                return { name: "Abril", days: 30 };
            case 4:
                return { name: "Maio", days: 31 };
            case 5:
                return { name: "Junho", days: 30 };
            case 6:
                return { name: "Julho", days: 31 };
            case 7:
                return { name: "Agosto", days: 31 };
            case 8:
                return { name: "Setembro", days: 30 };
            case 9:
                return { name: "Outubro", days: 31 };
            case 10:
                return { name: "Novembro", days: 30 };
            case 11:
                return { name: "Dezembro", days: 31 };
            default:
                return { name: "Janeiro", days: 31 };
        }
    }

    update() {
        this.time = new Date();

        if (this.el) {
            //Data e Hora
            const dayOfWeek = this.time.getDay();
            const year = this.time.getFullYear();
            const month = this.time.getMonth();
            const day = this.time.getDate();
            const hr = this.time.getHours();
            const min = this.time.getMinutes();
            const sec = this.time.getSeconds();
            const dayOfWeekName = this.getDayOfWeek(dayOfWeek);
            const monthInfo = this.getMonthInfo(month, year);
            const m_progress = sec / 60;
            const h_progress = (min + m_progress) / 60;
            const d_progress = (hr + h_progress) / 24;
            const mo_progress = ((day - 1) + d_progress) / monthInfo.days;
            const units = [
                {
                    label: "w",
                    value: dayOfWeekName
                },

                {
                    label: "mo",
                    value: monthInfo.name,
                    progress: mo_progress
                },

                {
                    label: "d",
                    value: day,
                    progress: d_progress
                },

                {
                    label: "h",
                    value: hr > 12 ? hr - 12 : hr,
                    progress: h_progress
                },

                {
                    label: "m",
                    value: min < 10 ? "0" + min : min,
                    progress: m_progress
                },

                {
                    label: "s",
                    value: sec < 10 ? "0" + sec : sec,
                },

                {
                    label: "ap",
                    value: hr > 11 ? "PM" : "AM",
                },
            ];
            //
            this.ringTimeouts.forEach(t => {
                clearTimeout(t);
            });
            this.ringTimeouts = [];

            //Atualiza o display
            units.forEach(u => {
                //aneis
                const ring = this.el.querySelector(`[data-ring="${u.label}"]`);
                if (ring) {
                    const strokeDashArray = ring.getAttribute("stroke-dasharray");
                    const fill360 = "progress-clock__ring-fill--360";

                    if (strokeDashArray) {
                        //Calcular stroke
                        const circunference = +strokeDashArray.split(" ")[0];
                        const strokeDashOffsetPct = 1 - u.progress;

                        ring.setAttribute(
                            "stroke-dashoffset",
                            strokeDashOffsetPct * circunference
                        );
                        //Adicionar a transição e removê-la

                        if (strokeDashOffsetPct === 1) {
                            ring.classList.add(fill360);
                            this.ringTimeouts.push(
                                setTimeout(() => {
                                    ring.classList.remove(fill360);
                                }, 600)
                            );
                        }

                    }
                }
                //Digitos
                const unit = this.el.querySelector(`[data-unit="${u.label}"]`);
                if (unit)
                    unit.innerText = u.value;
            });
        }
        clearTimeout(this.updateTimeout);
        this.updateTimeout = setTimeout(this.update.bind(this), 1e3)
    }
}