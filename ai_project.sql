-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sty 07, 2025 at 10:47 AM
-- Wersja serwera: 10.4.32-MariaDB
-- Wersja PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ai_project`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `budynek`
--

CREATE TABLE `budynek` (
  `id_budynku` int(11) NOT NULL,
  `nazwa` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `budynek_wydzial`
--

CREATE TABLE `budynek_wydzial` (
  `id_budynku` int(11) NOT NULL,
  `id_wydzialu` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `grupa`
--

CREATE TABLE `grupa` (
  `id_grupy` int(11) NOT NULL,
  `nazwa` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `prowadzacy`
--

CREATE TABLE `prowadzacy` (
  `nr_indeksu_p` int(5) NOT NULL,
  `imie_p` varchar(50) NOT NULL,
  `nazwisko_p` varchar(50) NOT NULL,
  `tytul_p` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `przedmiot`
--

CREATE TABLE `przedmiot` (
  `id_przedmiotu` int(11) NOT NULL,
  `nazwa` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `przedmiot_prowadzacy`
--

CREATE TABLE `przedmiot_prowadzacy` (
  `id_przedmiotu` int(11) NOT NULL,
  `nr_indeksu_p` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `sala`
--

CREATE TABLE `sala` (
  `id_sali` int(11) NOT NULL,
  `nr_sali` int(3) NOT NULL,
  `id_budynku` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `student`
--

CREATE TABLE `student` (
  `nr_indeksu_s` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `student_grupa`
--

CREATE TABLE `student_grupa` (
  `nr_indeksu_s` int(5) NOT NULL,
  `id_grupy` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `wydzial`
--

CREATE TABLE `wydzial` (
  `id_wydzialu` int(11) NOT NULL,
  `nazwa` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `zajecia`
--

CREATE TABLE `zajecia` (
  `id_zajecia` int(11) NOT NULL,
  `id_przedmiotu` int(11) NOT NULL,
  `forma` varchar(20) NOT NULL,
  `id_sali` int(11) NOT NULL,
  `id_grupy` int(11) NOT NULL,
  `godzina_od` time NOT NULL,
  `godzina_do` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `budynek`
--
ALTER TABLE `budynek`
  ADD PRIMARY KEY (`id_budynku`);

--
-- Indeksy dla tabeli `budynek_wydzial`
--
ALTER TABLE `budynek_wydzial`
  ADD PRIMARY KEY (`id_budynku`,`id_wydzialu`),
  ADD KEY `id_wydzialu` (`id_wydzialu`);

--
-- Indeksy dla tabeli `grupa`
--
ALTER TABLE `grupa`
  ADD PRIMARY KEY (`id_grupy`);

--
-- Indeksy dla tabeli `prowadzacy`
--
ALTER TABLE `prowadzacy`
  ADD PRIMARY KEY (`nr_indeksu_p`);

--
-- Indeksy dla tabeli `przedmiot`
--
ALTER TABLE `przedmiot`
  ADD PRIMARY KEY (`id_przedmiotu`);

--
-- Indeksy dla tabeli `przedmiot_prowadzacy`
--
ALTER TABLE `przedmiot_prowadzacy`
  ADD PRIMARY KEY (`id_przedmiotu`,`nr_indeksu_p`),
  ADD KEY `nr_indeksu_p` (`nr_indeksu_p`);

--
-- Indeksy dla tabeli `sala`
--
ALTER TABLE `sala`
  ADD PRIMARY KEY (`id_sali`),
  ADD KEY `id_budynku` (`id_budynku`);

--
-- Indeksy dla tabeli `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`nr_indeksu_s`);

--
-- Indeksy dla tabeli `student_grupa`
--
ALTER TABLE `student_grupa`
  ADD PRIMARY KEY (`nr_indeksu_s`,`id_grupy`),
  ADD KEY `id_grupy` (`id_grupy`);

--
-- Indeksy dla tabeli `wydzial`
--
ALTER TABLE `wydzial`
  ADD PRIMARY KEY (`id_wydzialu`);

--
-- Indeksy dla tabeli `zajecia`
--
ALTER TABLE `zajecia`
  ADD PRIMARY KEY (`id_zajecia`),
  ADD KEY `id_przedmiotu` (`id_przedmiotu`),
  ADD KEY `id_sali` (`id_sali`),
  ADD KEY `id_grupy` (`id_grupy`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `budynek`
--
ALTER TABLE `budynek`
  MODIFY `id_budynku` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `grupa`
--
ALTER TABLE `grupa`
  MODIFY `id_grupy` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `przedmiot`
--
ALTER TABLE `przedmiot`
  MODIFY `id_przedmiotu` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sala`
--
ALTER TABLE `sala`
  MODIFY `id_sali` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `wydzial`
--
ALTER TABLE `wydzial`
  MODIFY `id_wydzialu` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `zajecia`
--
ALTER TABLE `zajecia`
  MODIFY `id_zajecia` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `budynek_wydzial`
--
ALTER TABLE `budynek_wydzial`
  ADD CONSTRAINT `budynek_wydzial_ibfk_1` FOREIGN KEY (`id_budynku`) REFERENCES `budynek` (`id_budynku`),
  ADD CONSTRAINT `budynek_wydzial_ibfk_2` FOREIGN KEY (`id_wydzialu`) REFERENCES `wydzial` (`id_wydzialu`);

--
-- Constraints for table `przedmiot_prowadzacy`
--
ALTER TABLE `przedmiot_prowadzacy`
  ADD CONSTRAINT `przedmiot_prowadzacy_ibfk_1` FOREIGN KEY (`id_przedmiotu`) REFERENCES `przedmiot` (`id_przedmiotu`),
  ADD CONSTRAINT `przedmiot_prowadzacy_ibfk_2` FOREIGN KEY (`nr_indeksu_p`) REFERENCES `prowadzacy` (`nr_indeksu_p`);

--
-- Constraints for table `sala`
--
ALTER TABLE `sala`
  ADD CONSTRAINT `sala_ibfk_1` FOREIGN KEY (`id_budynku`) REFERENCES `budynek` (`id_budynku`);

--
-- Constraints for table `student_grupa`
--
ALTER TABLE `student_grupa`
  ADD CONSTRAINT `student_grupa_ibfk_1` FOREIGN KEY (`nr_indeksu_s`) REFERENCES `student` (`nr_indeksu_s`),
  ADD CONSTRAINT `student_grupa_ibfk_2` FOREIGN KEY (`id_grupy`) REFERENCES `grupa` (`id_grupy`);

--
-- Constraints for table `zajecia`
--
ALTER TABLE `zajecia`
  ADD CONSTRAINT `zajecia_ibfk_1` FOREIGN KEY (`id_przedmiotu`) REFERENCES `przedmiot` (`id_przedmiotu`),
  ADD CONSTRAINT `zajecia_ibfk_2` FOREIGN KEY (`id_sali`) REFERENCES `sala` (`id_sali`),
  ADD CONSTRAINT `zajecia_ibfk_3` FOREIGN KEY (`id_grupy`) REFERENCES `grupa` (`id_grupy`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
