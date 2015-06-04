-- phpMyAdmin SQL Dump
-- version 4.2.12deb2
-- http://www.phpmyadmin.net
--
-- Client :  localhost
-- Généré le :  Jeu 04 Juin 2015 à 13:48
-- Version du serveur :  5.5.43-0+deb8u1
-- Version de PHP :  5.6.7-1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données :  `daarrt`
--
CREATE DATABASE IF NOT EXISTS `daarrt` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `daarrt`;

-- --------------------------------------------------------

--
-- Structure de la table `config`
--

CREATE TABLE IF NOT EXISTS `config` (
  `var` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `documents`
--

CREATE TABLE IF NOT EXISTS `documents` (
`id` int(11) NOT NULL,
  `title` varchar(16) NOT NULL,
  `subtitle` varchar(150) NOT NULL,
  `type` enum('tuto','datasheet','wiki') NOT NULL,
  `tags` varchar(255) NOT NULL,
  `path` varchar(255) NOT NULL,
  `raw_data` longtext NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=96 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `groups`
--

CREATE TABLE IF NOT EXISTS `groups` (
`id` int(11) NOT NULL,
  `id_ori` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `members` varchar(255) NOT NULL,
  `daarrt` varchar(50) NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `online`
--

CREATE TABLE IF NOT EXISTS `online` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `address` varchar(15) NOT NULL,
  `groups` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `td`
--

CREATE TABLE IF NOT EXISTS `td` (
`id` int(11) NOT NULL,
  `title` varchar(50) NOT NULL,
  `subtitle` varchar(100) NOT NULL,
  `enonce` varchar(255) NOT NULL,
  `ressources` varchar(255) NOT NULL,
  `correction` varchar(255) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;

--
-- Index pour les tables exportées
--

--
-- Index pour la table `config`
--
ALTER TABLE `config`
 ADD UNIQUE KEY `var` (`var`);

--
-- Index pour la table `documents`
--
ALTER TABLE `documents`
 ADD PRIMARY KEY (`id`), ADD FULLTEXT KEY `title` (`title`,`subtitle`,`tags`,`raw_data`), ADD FULLTEXT KEY `SEARCH` (`raw_data`,`title`,`subtitle`,`tags`), ADD FULLTEXT KEY `title_2` (`title`,`subtitle`,`tags`,`raw_data`), ADD FULLTEXT KEY `title_3` (`title`,`subtitle`,`tags`,`raw_data`), ADD FULLTEXT KEY `title_4` (`title`,`subtitle`,`tags`,`raw_data`), ADD FULLTEXT KEY `title_5` (`title`,`subtitle`,`tags`,`raw_data`), ADD FULLTEXT KEY `tags` (`tags`), ADD FULLTEXT KEY `title_6` (`title`,`subtitle`,`tags`,`raw_data`);

--
-- Index pour la table `groups`
--
ALTER TABLE `groups`
 ADD PRIMARY KEY (`id`);

--
-- Index pour la table `online`
--
ALTER TABLE `online`
 ADD UNIQUE KEY `id` (`id`);

--
-- Index pour la table `td`
--
ALTER TABLE `td`
 ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `documents`
--
ALTER TABLE `documents`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=96;
--
-- AUTO_INCREMENT pour la table `groups`
--
ALTER TABLE `groups`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=36;
--
-- AUTO_INCREMENT pour la table `td`
--
ALTER TABLE `td`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=15;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
