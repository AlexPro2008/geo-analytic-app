// обработка логики
import {ScoreState} from "../models/interfaces/ScoreDefinition";
import {RecommendationResult} from "../models/interfaces/RecommendationResult";

// оценка
export const score = (percent:number,lowCase:ScoreState,
               middleCase:ScoreState
               ,bestCase:ScoreState) : ScoreState => {

    // проверка процент
    percent = percent ?? 0;

    // если ниже 30
    if(percent <= 30) {
          return lowCase;
    } // if

    // если выше 60 процентов
    if(percent <= 60){
        return middleCase;
    } // if

    // а иначе если поток пропустил блоки ветвления
    return bestCase;
};

// оценка default
export const resultDefault = (percent:number) =>
    score(percent,
        {text:"низкая",variant:"danger"}
        ,{text:"нормальная",variant:"warning"}
        , {text:"высокая",variant:"success"});


// оценка плотности
export const resultDensity = (density:number) =>
    score(density,
    {text:"сильное",variant:"danger"},{text:"нормальное",
        variant:"warning"},{text:"комфортное",variant:"success"});



// Рекомендации
export const getLevel = (percent: number) => {
    if (percent <= 30) return "low";
    if (percent <= 60) return "medium";
    return "high";
};


export const recommendationConcurrency = (percentConcurrency:number):RecommendationResult => {
    const level = getLevel(percentConcurrency);

    switch (level) {
        case "low":
            return {
                text: "Высокая конкуренция. В области доминируют другие игроки.",
                description: "Количество конкурентов превышает ваши точки, что снижает потенциальную долю рынка.",
                action: "Рекомендуется искать менее насыщенную область или усиливать конкурентное преимущество."
            };

        case "medium":
            return {
                text: "Умеренная конкуренция.",
                description: "Баланс между вашими точками и конкурентами нестабилен.",
                action: "Можно размещаться, но важно учитывать стратегию роста и дифференциацию."
            };

        case "high":
            return {
                text: "Низкая конкуренция.",
                description: "Ваши точки доминируют или конкуренты представлены слабо.",
                action: "Отличная зона для расширения сети."
            };
    }
};


export const recommendationDistance = (percentDistance:number):RecommendationResult => {
    const level = getLevel(percentDistance);

    switch (level) {
        case "low":
            return {
                text: "Критично плохое расположение.",
                description: "Точки расположены слишком близко — риск каннибализации или давления конкурентов.",
                action: "Увеличьте дистанцию до своих точек и отдалитесь от конкурентов."
            };

        case "medium":
            return {
                text: "Допустимое расположение.",
                description: "Есть риски пересечения зон влияния.",
                action: "Оптимизируйте позицию — найдите баланс между охватом и плотностью."
            };

        case "high":
            return {
                text: "Оптимальная дистанция.",
                description: "Хороший баланс между охватом и конкуренцией.",
                action: "Можно использовать как референс для будущих точек."
            };
    }
};


export const recommendationDensity = (percentDensity:number):RecommendationResult => {
    const level = getLevel(percentDensity);

    switch (level) {
        case "low":
            return {
                text: "Перенасыщенная зона.",
                description: "Слишком высокая концентрация точек увеличивает конкуренцию.",
                action: "Рекомендуется выбрать менее плотный район."
            };

        case "medium":
            return {
                text: "Умеренная плотность.",
                description: "Рынок сбалансирован, но есть давление.",
                action: "Размещение возможно при наличии сильного позиционирования."
            };

        case "high":
            return {
                text: "Оптимальная плотность.",
                description: "Комфортная рыночная среда без перегрузки.",
                action: "Хорошее место для открытия новой точки."
            };
    }
};

export const recommendationUniqueness = (percentUniqueness:number):RecommendationResult => {
    const level = getLevel(percentUniqueness);

    switch (level) {
        case "low":
            return {
                text: "Низкая уникальность.",
                description: "Много аналогичных предложений на рынке.",
                action: "Нужно усиливать УТП (Уникальность типа предприятия) или искать другую локацию."
            };

        case "medium":
            return {
                text: "Средняя уникальность.",
                description: "Есть конкуренты, но возможна дифференциация.",
                action: "Рекомендуется выделиться через продукт или сервис."
            };

        case "high":
            return {
                text: "Высокая уникальность.",
                description: "Минимум конкурентов с аналогичной деятельностью.",
                action: "Отличная возможность занять нишу."
            };
    }
};

export const recommendationTotal = (data:number):RecommendationResult => {

    // получаем уровень
    const level = getLevel(data);

    switch (level) {
        case "low":
            return {
                text: "Рискованная локация",
                action: "Нужно подобрать иную локацию так как многие факторы не благоприятны.",
                description: "Высокая конкуренция или неблагоприятное распределение точек."
            };


        case "medium":
            return {
                text: "Перспективная локация",
                action:"Точка перспективная, но риски добавляет некоторую сложность",
                description: "Есть потенциал, но отдельные метрики требуют внимания."
            };

        case "high":
            return {
                text: "Отличная локация",
                action:"Место отличное для открытие точки, много благоприятных факторов.",
                description:
                    "Высокая конкурентоспособность при оптимальной плотности и хорошей уникальности."
            };
    } // switch
};

