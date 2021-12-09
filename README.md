# gamesGIS
Service providing aliases with geolocation for game Escape from tarkov

Пэт-проект, на котором мы собираемся обкатать разрозненные знания, собрав их для себя в какое-то единое представление. Проект будет из себя представлять связку в виде Frontend(Typescript, React, Redux, Router) + Backend(Typescript, Node.js, Express.js, SQLite)
Проект постараемся вести итеративно, формируя документацию как на большом проекте, но без крайнего фанатизма в духе Fully Dressed Use Case-ов. С большой долей вероятности, в целях экономии времени use case-ы будут реализовываться в духе *happy path scenario* с незначительным покрытием самых грубых extension-ов.

## Запуск

**npm install** - поставит зависимости в корневом package.json-е, после запустит установку зависимостей в client проекте и server проекте

**npm run build** - собирает create-react-app приложение клиентской части, копирует результат компиляции в проект серверной части, собирает серверную часть 

**npm run start-server** - запускает сервер, который с корневой директории отдает React SPA

Для запуска подпроектов по отдельности, переходим в папки к соответствующим package.json-ам

## Описание проекта
Документацию на проект можно посмотреть в папке [unified process artifacts](unified%20process%20artifacts). В процессе итераций разработки данная документация будет дополняться деталями реализации/анализа задач. Автор не ставит перед собой цели собрать все портянку возможных документаций, в конце концов он не метит на лавры project manager-а.

[Vision](unified%20process%20artifacts/1.Vision.md) - документ описывающий, что вообще собираемся делать.

[Use cases](unified%20process%20artifacts/2.Use%20cases.md) - документ содержащий пользовательские сценарии, из которых будет состоять данный сервис.

[Supplementary specification](unified%20process%20artifacts/3.Supplementary%20specification.md) - нефункциональные требования к проекту, которым нет места в пользовательских историях.

[Glossary and Domain rules](unified%20process%20artifacts/4.Glossary%20and%20Domain%20Rules.md) - словарь терминов и бизнес правила, объединен в один документ, в силу микроскопичности данного проекта

[System architecture document](unified%20process%20artifacts/5.System%20architecture%20document.md) - документ, фиксирующий детали реализации