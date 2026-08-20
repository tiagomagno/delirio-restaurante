-- MySQL dump 10.13  Distrib 8.4.3, for Win64 (x86_64)
--
-- Host: localhost    Database: delirio_admin
-- ------------------------------------------------------
-- Server version	8.4.3

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `delirio_admin`
--

-- (removido: cria banco "delirio_admin" com nome errado) -- CREATE DATABASE /*!32312 IF NOT EXISTS*/ `delirio_admin` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

-- (removido: USE "delirio_admin" com nome errado) -- USE `delirio_admin`;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('194ab796-bdfa-4948-aa21-63712ced0b85','460f1d0af5ad5745d4b58a9c82cee22f4ba6e11916b555049ebb83a36d5838d9','2026-08-19 15:42:16.499','20260819154216_init',NULL,NULL,'2026-08-19 15:42:16.448',1),('24a41a05-f5eb-409e-ba12-dca7a2326d9c','9da126ddc3b30aad68481fdbc33da2f8fa8d6786ed038a471be435cb468c1cbd','2026-08-19 15:52:15.719','20260819155215_url_text_fields',NULL,NULL,'2026-08-19 15:52:15.683',1),('25711fbb-1cf9-4111-b60e-88d18c2fff2c','a5e1dffeb77b341bc8e23e502547616b11c162e68feb3f95107fec4c5693f4c3','2026-08-19 17:42:44.843','20260819174244_event_requests_and_contacts',NULL,NULL,'2026-08-19 17:42:44.820',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `adminuser`
--

DROP TABLE IF EXISTS `adminuser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `adminuser` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `passwordHash` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `AdminUser_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adminuser`
--

LOCK TABLES `adminuser` WRITE;
/*!40000 ALTER TABLE `adminuser` DISABLE KEYS */;
-- (removido: hash de senha do admin, sera recriado via seed) -- INSERT INTO `adminuser` VALUES ('cmt0a12he0000vhf4s8hc0ze8','admin@delirio.com.br','$2b$10$GT22cdcaMBqlC/g/DeAfYuNF30Hu9KfwuSWqHNVcJbEOXUth9kDY2','2026-08-19 15:59:03.890');
/*!40000 ALTER TABLE `adminuser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contactmessage`
--

DROP TABLE IF EXISTS `contactmessage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contactmessage` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lojaEmail` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lojaNome` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nome` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `celular` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mensagem` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contactmessage`
--

LOCK TABLES `contactmessage` WRITE;
/*!40000 ALTER TABLE `contactmessage` DISABLE KEYS */;
/*!40000 ALTER TABLE `contactmessage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `eventrequest`
--

DROP TABLE IF EXISTS `eventrequest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `eventrequest` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lojaEmail` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lojaNome` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nome` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pessoas` int NOT NULL,
  `data` datetime(3) DEFAULT NULL,
  `telefone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `celular` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descricao` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventrequest`
--

LOCK TABLES `eventrequest` WRITE;
/*!40000 ALTER TABLE `eventrequest` DISABLE KEYS */;
/*!40000 ALTER TABLE `eventrequest` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `heroslide`
--

DROP TABLE IF EXISTS `heroslide`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `heroslide` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `imageUrl` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order` int NOT NULL DEFAULT '0',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `heroslide`
--

LOCK TABLES `heroslide` WRITE;
/*!40000 ALTER TABLE `heroslide` DISABLE KEYS */;
INSERT INTO `heroslide` VALUES ('cmt09rzlf0001vhd42k17mx5w','https://delirio.com.br/wp-content/uploads/2023/09/banner_delirio_7.jpg',0,1,'2026-08-19 15:52:00.244'),('cmt09rzlh0002vhd4b6rku5t2','https://delirio.com.br/wp-content/uploads/2023/09/banner_delirio_6.jpg',1,1,'2026-08-19 15:52:00.246'),('cmt09rzlj0003vhd4wkddc9uw','https://delirio.com.br/wp-content/uploads/2023/09/banner_delirio_4.jpg',2,1,'2026-08-19 15:52:00.248'),('cmt09rzll0004vhd4fumqtefo','https://delirio.com.br/wp-content/uploads/2023/05/Delirio_slide2.jpg',3,1,'2026-08-19 15:52:00.250');
/*!40000 ALTER TABLE `heroslide` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pagecontent`
--

DROP TABLE IF EXISTS `pagecontent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pagecontent` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `page` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `PageContent_page_key_key` (`page`,`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pagecontent`
--

LOCK TABLES `pagecontent` WRITE;
/*!40000 ALTER TABLE `pagecontent` DISABLE KEYS */;
INSERT INTO `pagecontent` VALUES ('cmt09sdwn0009vh74yfcccu38','global','title.default','Título padrão do site','Delírio Tropical — Restaurante Saudável desde 1983','2026-08-19 15:52:18.792'),('cmt09sdwr000avh74i7wesda5','global','description','Descrição padrão (SEO)','Culinária natural, fresca e saborosa desde 1983. Lojas no Rio de Janeiro e Niterói. Encomendas online, delivery e eventos corporativos.','2026-08-19 15:52:18.796'),('cmt09sdwu000bvh74xdpe46oi','home','meta.title','Título (SEO)','Delírio Tropical — Restaurante Saudável desde 1983','2026-08-19 15:52:18.798'),('cmt09sdww000cvh7404jntotr','home','meta.description','Descrição (SEO)','Culinária natural, fresca e saborosa no Rio de Janeiro e Niterói. Encomendas online, delivery e eventos corporativos personalizados.','2026-08-19 15:52:18.800'),('cmt09sdwy000dvh7442c6s6ve','home','hero.cta','Botão do banner principal','veja o cardápio do dia','2026-08-19 15:52:18.802'),('cmt09sdx0000evh7494gyvdpj','home','escolha.title','Título da seção \"Escolha a opção\"','Escolha a opção que melhor lhe atende','2026-08-19 15:52:18.804'),('cmt09sdx2000fvh74acbslh6q','home','escolha.encomendas.desc','Texto do card Encomendas','Faça seu pedido por aqui, receba em casa\nou agende a retirada na loja mais próxima','2026-08-19 17:29:28.682'),('cmt09sdx5000gvh74e7vdd3xi','home','escolha.encomendas.cta','Botão do card Encomendas','Faça seu pedido','2026-08-19 17:29:28.679'),('cmt09sdx7000hvh74v25dy6vv','home','escolha.eventos.label','Rótulo do card Eventos','Eventos\nCorporativos\ne Familiares','2026-08-19 15:52:18.811'),('cmt09sdx9000ivh74zdox1tbn','home','escolha.eventos.desc','Texto do card Eventos','Contate nossa equipe para\nauxiliá-lo na criação de seu evento','2026-08-19 15:52:18.813'),('cmt09sdxb000jvh74ctcct3yh','home','escolha.eventos.cta','Botão do card Eventos','Solicite um orçamento','2026-08-19 15:52:18.815'),('cmt09sdxd000kvh74vf20hdri','home','historia.title','Título \"Desde 1983\"','Desde\n1983','2026-08-19 15:52:18.817'),('cmt09sdxf000lvh747cm64lc6','home','historia.text','Parágrafo \"Desde 1983\"','Todos os dias, preparamos uma comida fresca, leve e muito saborosa com amor e carinho.','2026-08-19 16:01:45.468'),('cmt09sdxh000mvh742zmg7wgk','home','historia.cta','Botão \"Saiba Mais\"','Saiba Mais','2026-08-19 15:52:18.821'),('cmt09sdxj000nvh74w4crspcs','sobre-nos','meta.title','Título (SEO)','Sobre Nós','2026-08-19 16:03:30.009'),('cmt09sdxl000ovh749jwq4rye','sobre-nos','meta.description','Descrição (SEO)','Conheça a história do Delírio Tropical, nascido em 1983 no centro do Rio de Janeiro.','2026-08-19 15:52:18.826'),('cmt09sdxo000pvh74ns06ojrp','sobre-nos','sust.title','Título Sustentabilidade','Nosso jeitinho\nDelírio de ser...\nmais sustentável!','2026-08-19 15:52:18.828'),('cmt09sdxq000qvh749nx00d43','sobre-nos','sust.intro','Texto Sustentabilidade','Acreditamos em um futuro melhor, com alimentação segura e saudável para todos. Por isso, investimos em ações que caminham juntos na mesma direção. Venha conhecer alguns dos selos e parceiros que garantem a qualidade de nosso trabalho.','2026-08-19 15:52:18.830'),('cmt09sdxs000rvh7474h9b8kl','sobre-nos','sust.cta','Botão Sustentabilidade','Acompanhe em nossas redes','2026-08-19 15:52:18.832'),('cmt09sdxu000svh74n5slunsx','sobre-nos','rancho.card1.text','Texto card Rancho 1 (plantação)','Com o passar dos anos, aprendemos a plantar, cultivar e colher, por isso muitos dos nossos alimentos provém de nossa horta orgânica.','2026-08-19 15:52:18.834'),('cmt09sdxw000tvh74qgotxzuh','sobre-nos','rancho.card2.text','Texto card Rancho 2 (compostagem)','Os resíduos orgânicos de nossas lojas viram adubo por meio da compostagem. Venha conhecer por trás desse processo!','2026-08-19 15:52:18.836'),('cmt09sdxz000uvh746hirgasb','sobre-nos','rancho.card3.text','Texto card Rancho 3 (alimentos)','Grande parte do segredo de nossas comida ser tão gostosa está aqui, nos cuidados com os alimentos desde o plantio, até a sua mesa.','2026-08-19 15:52:18.839'),('cmt09sdy1000vvh74x75ocq7q','sobre-nos','rancho.title','Título \"Conheça o rancho\"','Conheça\no rancho','2026-08-19 15:52:18.842'),('cmt09sdy3000wvh74uuitxwb4','sobre-nos','rancho.desc','Texto \"Conheça o rancho\"','Valorizamos a proveniência dos alimentos. Nossa relação com o Rancho São Francisco é uma parceria de longa data onde cultivamos nossos alimentos orgânicos.','2026-08-19 15:52:18.844'),('cmt09sdy6000xvh74ym3o1j8n','sobre-nos','livro.title','Título Livro','Livro\nDelírio Tropical','2026-08-19 15:52:18.846'),('cmt09sdy8000yvh74op6zvcko','sobre-nos','livro.desc','Texto Livro','Há 4 décadas, nascia o Delírio Tropical com um sonho simples: levar comida leve, saudável e cheia de sabor para os cariocas. Esse sonho cresceu, atravessou gerações e se tornou parte da história da Cidade Maravilhosa. Essa jornada esta registrada em nosso livro especial de 40 anos, uma coleção receitas e sabores que contam histórias.','2026-08-19 15:52:18.848'),('cmt09sdya000zvh74ti12rqic','sobre-nos','livro.cta','Botão Livro','Acesse e leve o Delírio para sua casa','2026-08-19 15:52:18.850'),('cmt09sdyc0010vh74y7xx95mh','lojas','meta.title','Título (SEO)','Lojas','2026-08-19 15:52:18.853'),('cmt09sdye0011vh74332xa9yg','lojas','meta.description','Descrição (SEO)','Encontre a loja Delírio Tropical mais próxima de você. Unidades em Assembléia, Tijuca, Rio Sul, Ipanema, Gávea, Citta América, Barra Shopping, Metropolitano (RJ) e Plaza Niterói.','2026-08-19 15:52:18.855'),('cmt09sdyh0012vh74jewipoo7','lojas','hero.title','Título do topo','Nossas Lojas','2026-08-19 15:52:18.857'),('cmt09sdyj0013vh74q24dsbco','lojas','hero.subtitle','Subtítulo do topo','Rio de Janeiro e Niterói — encontre a loja mais próxima de você','2026-08-19 15:52:18.859'),('cmt09sdyl0014vh7466lnjvc7','encomendas','meta.title','Título (SEO)','Encomendas','2026-08-19 16:03:30.013'),('cmt09sdyn0015vh74bdyqvb12','encomendas','hero.title','Título do topo','Encomendas','2026-08-19 15:52:18.863'),('cmt09sdyp0016vh74fdf5oq2o','encomendas','hero.subtitle','Subtítulo do topo','Peça nossos pratos favoritos para entregar onde você quiser','2026-08-19 15:52:18.865'),('cmt09sdyr0017vh74i4ul7e37','encomendas','opcoes.title','Título \"Escolha como prefere\"','Escolha como prefere','2026-08-19 15:52:18.867'),('cmt09sdyt0018vh741vdielpn','encomendas','opcoes.subtitle','Subtítulo \"Escolha como prefere\"','Encomende para receber em casa ou para seu evento corporativo e familiar','2026-08-19 15:52:18.869'),('cmt09sdyw0019vh742dich0o4','encomendas','card1.title','Título card Delivery','Peça pelo delivery','2026-08-19 15:52:18.872'),('cmt09sdyy001avh74tjfyi2g0','encomendas','card1.desc','Texto card Delivery','Faça seu pedido por aqui, receba em casa ou agende a retirada na loja mais próxima de você.','2026-08-19 15:52:18.874'),('cmt09sdz0001bvh746evem9cm','encomendas','card1.cta','Botão card Delivery','Fazer meu pedido','2026-08-19 15:52:18.876'),('cmt09sdz2001cvh74f8ey9qlk','encomendas','card2.title','Título card Eventos','Eventos e confraternizações','2026-08-19 15:52:18.878'),('cmt09sdz4001dvh740xmqn4q6','encomendas','card2.desc','Texto card Eventos','Nossa equipe está pronta para auxiliá-lo na criação do menu perfeito para o seu evento.','2026-08-19 15:52:18.881'),('cmt09sdz7001evh74ruh96djt','encomendas','card2.cta','Botão card Eventos','Solicitar orçamento','2026-08-19 15:52:18.883'),('cmt09sdz9001fvh74vrix3441','encomendas','info.title','Título \"Por que encomendar\"','Por que encomendar com a gente?','2026-08-19 15:52:18.885'),('cmt09sdzb001gvh74bbnkvybx','encomendas','info.stat1.num','Estatística 1 — número','+40','2026-08-19 15:52:18.888'),('cmt09sdze001hvh74tboifxtc','encomendas','info.stat1.label','Estatística 1 — legenda','Anos servindo\no Rio de Janeiro','2026-08-19 15:52:18.890'),('cmt09sdzg001ivh74ly7klf63','encomendas','info.stat2.num','Estatística 2 — número','9','2026-08-19 15:52:18.892'),('cmt09sdzi001jvh74wuf0qn65','encomendas','info.stat2.label','Estatística 2 — legenda','Lojas para\nretirada rápida','2026-08-19 15:52:18.894'),('cmt09sdzk001kvh74j45t04i8','encomendas','info.stat3.num','Estatística 3 — número','100%','2026-08-19 15:52:18.897'),('cmt09sdzm001lvh74yi6r8aay','encomendas','info.stat3.label','Estatística 3 — legenda','Ingredientes frescos\npreparados no dia','2026-08-19 15:52:18.899'),('cmt09sdzo001mvh74zc84q50i','trabalhe-conosco','meta.title','Título (SEO)','Trabalhe com a Gente','2026-08-19 15:52:18.901'),('cmt09sdzq001nvh740se1sg8m','trabalhe-conosco','meta.description','Descrição (SEO)','Faça parte da equipe Delírio Tropical. Confira as vagas disponíveis para atendente, auxiliar de cozinha, saladeiro, cozinheiro e mais. Candidate-se agora.','2026-08-19 15:52:18.903'),('cmt09sdzt001ovh741dp1rzns','trabalhe-conosco','hero.title','Título do topo','Trabalhe com a Gente','2026-08-19 15:52:18.905'),('cmt09sdzv001pvh74iubmlvqm','trabalhe-conosco','hero.subtitle','Subtítulo do topo','Faça parte da nossa equipe','2026-08-19 15:52:18.907'),('cmt09sdzx001qvh743s8o477a','trabalhe-conosco','form.title','Título do formulário','Trabalhe com a Gente','2026-08-19 15:52:18.909'),('cmt09sdzz001rvh7428981jmm','trabalhe-conosco','form.description','Texto introdutório do formulário','Nossa missão é servir nossos clientes diariamente com muito amor. Trabalhando no Delírio Tropical você poderá exercer esse lindo ofício e perceber da importância do cuidado com as pessoas. Nossos primeiros clientes são nossos colaboradores, e damos oportunidade de crescimento para todas as pessoas da nossa equipe.','2026-08-19 15:52:18.911'),('cmt09se01001svh74s5nqdzcl','eventos-corporativos','meta.title','Título (SEO)','Eventos Corporativos','2026-08-19 15:52:18.913'),('cmt09se03001tvh74td9e2th1','eventos-corporativos','meta.description','Descrição (SEO)','Planeje seu evento corporativo ou familiar com o Delírio Tropical. Cardápio personalizado, atendimento exclusivo e sugestões feitas pelo gerente da loja escolhida.','2026-08-19 15:52:18.916'),('cmt09se06001uvh74u3f6782y','eventos-corporativos','hero.title','Título do topo','Eventos Corporativos','2026-08-19 15:52:18.918'),('cmt09se08001vvh74cskw0ggx','eventos-corporativos','hero.subtitle','Subtítulo do topo','Cardápio personalizado para o evento da sua empresa','2026-08-19 15:52:18.920'),('cmt09se0a001wvh74ijeptvvv','eventos-corporativos','form.title','Título do formulário','Faça o seu evento com o Delírio!','2026-08-19 15:52:18.922'),('cmt09se0c001xvh74kdf3mage','eventos-corporativos','form.description','Texto introdutório do formulário','Preparamos um cardápio personalizado para o evento da sua empresa.\nO gerente da loja escolhida vai entrar em contato com um cardápio e\nsugestões personalizadas para o seu evento!','2026-08-19 15:52:18.924'),('cmt09se0e001yvh74pirfpvtb','fale-conosco','meta.title','Título (SEO)','Fale Conosco','2026-08-19 15:52:18.927'),('cmt09se0g001zvh74ei5g4v79','fale-conosco','meta.description','Descrição (SEO)','Entre em contato com a loja Delírio Tropical de sua preferência. Envie sua mensagem e nossa equipe retornará em breve.','2026-08-19 15:52:18.929'),('cmt09se0i0020vh74m289kw36','fale-conosco','hero.title','Título do topo','Fale Conosco','2026-08-19 15:52:18.931'),('cmt09se0l0021vh74bh1meozt','fale-conosco','hero.subtitle','Subtítulo do topo','Assim poderemos servir ainda melhor','2026-08-19 15:52:18.933'),('cmt09se0n0022vh74c8al3u0z','fale-conosco','form.title','Título do formulário','Envie sua mensagem','2026-08-19 15:52:18.935'),('cmt09se0p0023vh74tg3h06f2','fale-conosco','form.description','Texto introdutório do formulário','Preencha o formulário abaixo e nossa equipe entrará em contato em breve.','2026-08-19 15:52:18.937'),('cmt09se0r0024vh74yf8893tg','ouvidoria','meta.title','Título (SEO)','Ouvidoria','2026-08-19 15:52:18.939'),('cmt09se0t0025vh74fi1ixb3j','ouvidoria','meta.description','Descrição (SEO)','Canal anônimo de ouvidoria do Delírio Tropical. Compartilhe sua opinião de forma confidencial. Sua voz é importante para a melhoria contínua dos nossos serviços.','2026-08-19 15:52:18.941'),('cmt09se0v0026vh74d8llspoc','ouvidoria','hero.title','Título do topo','Ouvidoria','2026-08-19 15:52:18.943'),('cmt09se0x0027vh74c5sh5hiw','ouvidoria','hero.subtitle','Subtítulo do topo','Sua voz é importante para nós','2026-08-19 15:52:18.945'),('cmt09se100028vh74xeqpoi7w','uso-e-privacidade','meta.title','Título (SEO)','Uso e Privacidade','2026-08-19 15:52:18.948'),('cmt09se120029vh749du56p6p','uso-e-privacidade','meta.description','Descrição (SEO)','Política de privacidade e termos de uso do Delírio Tropical. Saiba como coletamos, usamos e protegemos suas informações pessoais.','2026-08-19 15:52:18.951'),('cmt09se15002avh74cyigam2u','uso-e-privacidade','hero.title','Título do topo','Uso e Privacidade','2026-08-19 15:52:18.953'),('cmt09se17002bvh743v9ksdrv','uso-e-privacidade','hero.subtitle','Subtítulo do topo','Política de privacidade do Delírio Tropical','2026-08-19 15:52:18.955'),('cmt09se19002cvh740wap2336','uso-e-privacidade','intro.title','Título introdução','Política de privacidade para Delírio Tropical','2026-08-19 15:52:18.957'),('cmt09se1b002dvh74qdfw8mts','uso-e-privacidade','intro.p1','Introdução — parágrafo 1','Todas as suas informações pessoais recolhidas, serão usadas para o ajudar a tornar a sua visita no nosso site o mais produtiva e agradável possível.','2026-08-19 15:52:18.959'),('cmt09se1d002evh74fz2sw4dp','uso-e-privacidade','intro.p2','Introdução — parágrafo 2','A garantia da confidencialidade dos dados pessoais dos utilizadores do nosso site é importante para o Delírio Tropical.','2026-08-19 15:52:18.962'),('cmt09se1f002fvh74nr4jped8','uso-e-privacidade','intro.p3','Introdução — parágrafo 3','Todas as informações pessoais relativas a membros, assinantes, clientes ou visitantes que usem o Delírio Tropical serão tratadas em concordância com a Lei da Proteção de Dados Pessoais de 26 de outubro de 1998 (Lei n.º 67/98).','2026-08-19 15:52:18.964'),('cmt09se1h002gvh74r2p2et6p','uso-e-privacidade','intro.p4','Introdução — parágrafo 4','A informação pessoal recolhida pode incluir o seu nome, e-mail, número de telefone e/ou telemóvel, morada, data de nascimento e/ou outros.','2026-08-19 15:52:18.966'),('cmt09se1k002hvh74ce14hya2','uso-e-privacidade','intro.p5','Introdução — parágrafo 5','O uso do Delírio Tropical pressupõe a aceitação deste Acordo de privacidade. A equipa do Delírio Tropical reserva-se ao direito de alterar este acordo sem aviso prévio. Deste modo, recomendamos que consulte a nossa política de privacidade com regularidade de forma a estar sempre atualizado.','2026-08-19 15:52:18.968'),('cmt09se1m002ivh74yaj2k58v','uso-e-privacidade','anuncios.title','Título \"Os anúncios\"','Os anúncios','2026-08-19 15:52:18.970'),('cmt09se1p002jvh745ug4j2m0','uso-e-privacidade','anuncios.p1','Texto \"Os anúncios\"','Tal como outros websites, coletamos e utilizamos informação contida nos anúncios. A informação contida nos anúncios inclui o seu endereço IP (Internet Protocol), o seu ISP (Internet Service Provider), o browser que utilizou ao visitar o nosso website, o tempo da sua visita e que páginas visitou dentro do nosso website.','2026-08-19 15:52:18.973'),('cmt09se1r002kvh74ot75eulf','uso-e-privacidade','dart.title','Título \"Cookie DoubleClick Dart\"','Cookie DoubleClick Dart','2026-08-19 15:52:18.976'),('cmt09se1u002lvh74bkl5pda7','uso-e-privacidade','dart.p1','Texto \"Cookie DoubleClick Dart\"','O Google, como fornecedor de terceiros, utiliza cookies para exibir anúncios no nosso website. Com o cookie DART, o Google pode exibir anúncios com base nas visitas que o leitor fez a outros websites na Internet. Os utilizadores podem desativar o cookie DART visitando a Política de privacidade da rede de conteúdo e dos anúncios do Google.','2026-08-19 15:52:18.979'),('cmt09se1y002mvh743c4tfj5u','uso-e-privacidade','cookies.title','Título \"Os Cookies e Web Beacons\"','Os Cookies e Web Beacons','2026-08-19 15:52:18.982'),('cmt09se21002nvh745d9or35f','uso-e-privacidade','cookies.p1','Cookies — parágrafo 1','Utilizamos cookies para armazenar informação, tais como as suas preferências pessoais quando visita o nosso website. Isto poderá incluir um simples popup, ou uma ligação em vários serviços que providenciamos, tais como fóruns.','2026-08-19 15:52:18.985'),('cmt09se25002ovh74vzt5w3ev','uso-e-privacidade','cookies.p2','Cookies — parágrafo 2','Em adição também utilizamos publicidade de terceiros no nosso website para suportar os custos de manutenção. Alguns destes publicitários, poderão utilizar tecnologias como os cookies e/ou web beacons quando publicitam no nosso website, o que fará com que esses publicitários (como o Google através do Google AdSense) também recebam o seu endereço IP pessoal.','2026-08-19 15:52:18.990'),('cmt09se27002pvh74sd5cmzu7','uso-e-privacidade','terceiros.title','Título \"Ligações a Sites de Terceiros\"','Ligações a Sites de Terceiros','2026-08-19 15:52:18.992'),('cmt09se29002qvh74kjbicv22','uso-e-privacidade','terceiros.p1','Terceiros — parágrafo 1','O Delírio Tropical possui ligações para outros sites, os quais, a nosso ver, podem conter informações úteis para os nossos visitantes. A nossa política de privacidade não é aplicada a sites de terceiros, pelo que, caso visite outro site a partir do nosso deverá ler a politica de privacidade do mesmo.','2026-08-19 15:52:18.994'),('cmt09se2c002rvh74pz8f8lsd','uso-e-privacidade','terceiros.p2','Terceiros — parágrafo 2','Não nos responsabilizamos pela política de privacidade ou conteúdo presente nesses mesmos sites.','2026-08-19 15:52:18.996');
/*!40000 ALTER TABLE `pagecontent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store`
--

DROP TABLE IF EXISTS `store`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` json NOT NULL,
  `bairroCity` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `region` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `photos` json DEFAULT NULL,
  `mapsUrl` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `deliveryUrl` text COLLATE utf8mb4_unicode_ci,
  `menuUrl` text COLLATE utf8mb4_unicode_ci,
  `hours` json NOT NULL,
  `phones` json NOT NULL,
  `whatsapp` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `highlight` tinyint(1) NOT NULL DEFAULT '0',
  `order` int NOT NULL DEFAULT '0',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Store_slug_key` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store`
--

LOCK TABLES `store` WRITE;
/*!40000 ALTER TABLE `store` DISABLE KEYS */;
INSERT INTO `store` VALUES ('cmt09sdvs0000vh74l2856v1i','assembleia','Assembléia','[\"Rua da Assembléia, 36\"]','Centro, Rio de Janeiro | RJ','rio','https://delirio.com.br/wp-content/uploads/2023/06/Assembleia-Baixa-5x5-591-px.jpg','[\"https://delirio.com.br/wp-content/uploads/2023/06/Balcao-sanduiche-GALERIA-1.jpg\", \"https://delirio.com.br/wp-content/uploads/2023/06/Fachada-Loja-01-GALERIA-1.jpg\", \"https://delirio.com.br/wp-content/uploads/2023/06/Balcao-panoramica-GALERIA-1.jpg\", \"https://delirio.com.br/wp-content/uploads/2023/06/Salao-Frente-GALERIA-1.jpg\", \"https://delirio.com.br/wp-content/uploads/2023/06/Fachada-Cafe-02-GALERIA-1.jpg\", \"https://delirio.com.br/wp-content/uploads/2023/06/Salao-fundos-2-piso-01-GALERIA-1.jpg\"]','https://www.google.com.br/maps/place/Delirio+Tropical/@-22.9046963,-43.1783802,17z/data=!3m1!4b1!4m6!3m5!1s0x997f5f76fcfeab:0x54ffb316f4d0d495!8m2!3d-22.9047013!4d-43.1758053!16s%2Fg%2F1t_wql81?entry=ttu','https://www.ifood.com.br/delivery/rio-de-janeiro-rj/delirio-tropical---assembleia-centro/35dc2a84-b721-4027-a1dc-a03e57124633?utm_medium=share','https://cardapiodigital.delirio.com.br/delirio/965e1d05-efa4-48d5-a0f4-fc9fdba6afee','[\"Segunda a Sexta de 8h às 16h\", \"Sáb, Dom e Feriados: Fechado\"]','[\"(21) 2242-6369\"]','5521997825789','dtass@delirio.com.br',1,0,1,'2026-08-19 15:52:18.760','2026-08-19 16:02:55.964'),('cmt09sdvw0001vh74laejn3xw','tijuca','Shopping Tijuca','[\"Av. Maracanã, 987, lojas 2 a 5\"]','Tijuca, Rio de Janeiro | RJ','rio','https://delirio.com.br/wp-content/uploads/2023/06/Tijuca-Baixa-5x5-591-px.jpg','[\"https://delirio.com.br/wp-content/uploads/2023/07/Salao-01-GALERIA-2.jpg\", \"https://delirio.com.br/wp-content/uploads/2023/07/Fachada-lateral-GALERIA-2.jpg\", \"https://delirio.com.br/wp-content/uploads/2023/07/Comodato-GALERIA-2.jpg\", \"https://delirio.com.br/wp-content/uploads/2023/07/Ripado-GALERIA-2.jpg\", \"https://delirio.com.br/wp-content/uploads/2023/07/Bancao-arvore-2-GALERIA-2.jpg\", \"https://delirio.com.br/wp-content/uploads/2023/07/Grab-Go-GALERIA-2.jpg\", \"https://delirio.com.br/wp-content/uploads/2023/07/Bancao-arvore-GALERIA-2.jpg\"]','https://www.google.com.br/maps/place/Del%C3%ADrio+Tropical/@-22.9219506,-43.2381971,17z/data=!3m1!4b1!4m6!3m5!1s0x997f9e4574f7dd:0x4d1cbab29439f7fb!8m2!3d-22.9219556!4d-43.2356222!16s%2Fg%2F11fsk9sld8?entry=ttu','https://www.ifood.com.br/delivery/rio-de-janeiro-rj/delirio-tropical---shopping-tijuca-tijuca/b18046dd-e115-4522-a02e-9d80a680908a?utm_medium=share','','[\"Segunda a Sábado de 11h às 22h\", \"Dom e Feriados de 12h às 21h\"]','[\"(21) 2230-5370\"]','5521997826115','dttijuca@delirio.com.br',0,1,1,'2026-08-19 15:52:18.764','2026-08-19 15:52:18.764'),('cmt09sdvz0002vh7435c9wh27','rio-sul','Shopping Rio Sul','[\"Av. Lauro Sodré, 445\"]','Botafogo, Rio de Janeiro | RJ','rio','https://delirio.com.br/wp-content/uploads/2023/06/Rio-Sul-Baixa-5x5-591-px.jpg','[\"https://delirio.com.br/wp-content/uploads/2023/07/Mezanino-2-CROP-1.jpg\", \"https://delirio.com.br/wp-content/uploads/2023/07/Fachada-2-CROP-1.jpg\", \"https://delirio.com.br/wp-content/uploads/2023/07/Grab-Go-CROP-1.jpg\", \"https://delirio.com.br/wp-content/uploads/2023/07/Balcao-CROP-1.jpg\", \"https://delirio.com.br/wp-content/uploads/2023/07/Mezanino-1-CROP-1.jpg\", \"https://delirio.com.br/wp-content/uploads/2023/07/Terreo-1-CROP-1.jpg\"]','https://www.google.com.br/maps/place/Del%C3%ADrio+Tropical/@-22.9571974,-43.179219,17z/data=!3m2!4b1!5s0x9bd55dbdbbeaf1:0x5da51a53ce815e24!4m6!3m5!1s0x997ff8fde49319:0xaaff47049a289550!8m2!3d-22.9572024!4d-43.1766441!16s%2Fg%2F11bwkyz65d?entry=ttu','https://www.ifood.com.br/delivery/rio-de-janeiro-rj/delirio-tropical---rio-sul-botafogo/a3323936-9ad8-468c-b84d-75b455dca7d4?utm_medium=share','https://cardapiodigital.delirio.com.br/delirio/dce05ee3-4573-4a49-9433-a5d12305faad','[\"Segunda a Sábado de 11h às 22h\", \"Dom e Feriados de 12h às 21h\"]','[\"(21) 2275-9572\"]','5521997699746','dtriosul@delirio.com.br',0,2,1,'2026-08-19 15:52:18.768','2026-08-19 15:52:18.768'),('cmt09sdw20003vh74bv1yuo5v','ipanema','Ipanema','[\"Rua Garcia D\'Avila, 48\"]','Ipanema, Rio de Janeiro | RJ','rio','https://delirio.com.br/wp-content/uploads/2023/06/Ipanema-Baixa-5x5-591-px.jpg','[\"https://delirio.com.br/wp-content/uploads/2023/07/loja_ipanema_noite-1-CROP-1.jpg\", \"https://delirio.com.br/wp-content/uploads/2023/07/01-fachada-Ipanema-CO-1-CROP-1-1.jpg\", \"https://delirio.com.br/wp-content/uploads/2023/07/02-fachada-Ipanema-CO-20-CROP-1.jpg\", \"https://delirio.com.br/wp-content/uploads/2023/07/03-Delirio-para-Levar-Ipanema-CROP-03-1.jpg\", \"https://delirio.com.br/wp-content/uploads/2023/07/Loja_ipanema_noite-3-CROP-1.jpg\", \"https://delirio.com.br/wp-content/uploads/2023/07/03-Delirio-para-Levar-Ipanema-CROP-01-1.jpg\"]','https://www.google.com.br/maps/place/Del%C3%ADrio+Tropical+Ipanema/@-22.9849715,-43.2117153,17z/data=!3m1!4b1!4m6!3m5!1s0x9bd50699c0b129:0x9bacde5344fcab4b!8m2!3d-22.9849765!4d-43.2091404!16s%2Fg%2F1tlbkt3m?entry=ttu','https://www.ifood.com.br/delivery/rio-de-janeiro-rj/delirio-tropical---ipanema-ipanema/8b8ba208-ced2-40fb-95bd-374b5846c376?utm_medium=share','https://cardapiodigital.delirio.com.br/delirio/7b9659ef-9dfc-4330-a828-cde89b0753eb','[\"Todos os dias de 11h às 20h\"]','[\"(21) 3624-8164\"]','5521971538244','secretaria.ipa@delirio.com.br',0,3,1,'2026-08-19 15:52:18.771','2026-08-19 15:52:18.771'),('cmt09sdw60004vh74m03zbb2u','gavea','Gávea','[\"Rua Marquês de São Vicente, 68\"]','Gávea, Rio de Janeiro | RJ','rio','https://delirio.com.br/wp-content/uploads/2023/06/Gavea-Baixa-5x5-591-px.jpg','[\"https://delirio.com.br/wp-content/uploads/2023/06/Salao-frente-CROP-1.jpg\", \"https://delirio.com.br/wp-content/uploads/2023/06/Salao-de-cima-2-CROP-1.jpg\", \"https://delirio.com.br/wp-content/uploads/2023/06/Salaozinho-CROP-1.jpg\", \"https://delirio.com.br/wp-content/uploads/2023/06/Balcao-frente-2-CROP-1.jpg\", \"https://delirio.com.br/wp-content/uploads/2023/06/Letreiro-CROP-1.jpg\", \"https://delirio.com.br/wp-content/uploads/2023/06/Balcao-de-cima-CROP-1.jpg\"]','https://www.google.com.br/maps/place/Del%C3%ADrio+Tropical+G%C3%A1vea/@-22.9760903,-43.2304537,17.5z/data=!4m6!3m5!1s0x9bd5b74672a933:0x42d971772a771430!8m2!3d-22.9759302!4d-43.2287239!16s%2Fg%2F1tghqt95?entry=ttu','https://www.ifood.com.br/delivery/rio-de-janeiro-rj/delirio-tropical---gavea-gavea/96916ae9-f4c2-4315-b4a0-cb2cfb37cd5f?utm_medium=share','https://cardapiodigital.delirio.com.br/delirio/2f546851-9d64-4fc0-a2fc-1912df983ecf','[\"Segunda a Sábado de 11h às 20h\", \"Dom e Feriados de 11h às 19h\"]','[\"(21) 3624-7055\"]','5521997720867','dtgav@delirio.com.br',0,4,1,'2026-08-19 15:52:18.774','2026-08-19 15:52:18.774'),('cmt09sdwa0005vh74qzk4yqnw','citta-america','Citta América','[\"Av. das Américas, 700 – Loja 114 B,C,D\"]','Barra da Tijuca, Rio de Janeiro | RJ','rio','https://delirio.com.br/wp-content/uploads/2023/07/01-Cafeteria-externa-BAIXA-CROP-SAT.jpg','[\"https://delirio.com.br/wp-content/uploads/2023/07/01-Cafeteria-externa-BAIXA-CROP-SAT.jpg\", \"https://delirio.com.br/wp-content/uploads/2023/07/02-Fachada-BAIXA-CROP-SAT.jpg\", \"https://delirio.com.br/wp-content/uploads/2023/07/03-Cafeteria-humanizada-BAIXA-CROP-SAT-1.jpg\", \"https://delirio.com.br/wp-content/uploads/2023/07/04-Varanda-BAIXA-CROP-SAT.jpg\", \"https://delirio.com.br/wp-content/uploads/2023/07/05-Externa-BAIXA-CROP-SAT.jpg\", \"https://delirio.com.br/wp-content/uploads/2023/07/6-Balcao-BAIXA-CROP-SAT.jpg\", \"https://delirio.com.br/wp-content/uploads/2023/07/07-Cafeteria-interna-BAIXA-CROP-SAT-1.jpg\"]','https://www.google.com.br/maps/place/Del%C3%ADrio+Tropical/@-23.0032836,-43.3232214,17z/data=!3m2!4b1!5s0x9bd9eb6e228109:0x6d6eb20c8c1d5d50!4m6!3m5!1s0x9bd0a519c2424b:0x24efb2ecd8424415!8m2!3d-23.0032886!4d-43.3206465!16s%2Fg%2F11bx1yr71w?entry=ttu','https://www.ifood.com.br/delivery/rio-de-janeiro-rj/delirio-tropical---citta-america-barra-da-tijuca/d06e794d-928e-4a69-9a8d-12c4671028bf?utm_medium=share','https://cardapiodigital.delirio.com.br/delirio/3965d1a1-8830-4cf6-b73f-db3485bd226a','[\"Segunda a Sábado de 11h às 17h\", \"Domingos: Fechado\"]','[\"(21) 2132-8007\"]','5521997528683','dtcit@delirio.com.br',0,5,1,'2026-08-19 15:52:18.778','2026-08-19 15:52:18.778'),('cmt09sdwd0006vh74drj53u2l','barra-shopping','Barra Shopping','[\"Av. das Américas, 4666, Loja 150\"]','Barra da Tijuca, Rio de Janeiro | RJ','rio','https://delirio.com.br/wp-content/uploads/2023/06/Barra-Baixa-5x5-591-px.jpg','[\"https://delirio.com.br/wp-content/uploads/2023/07/00-Externa-01-CROP-1.jpg\", \"https://delirio.com.br/wp-content/uploads/2023/07/00-Ripado-01-CROP-2.jpg\", \"https://delirio.com.br/wp-content/uploads/2023/07/00-Varanda-01-CROP-1.jpg\", \"https://delirio.com.br/wp-content/uploads/2023/07/00-Externo-03-CROP-1.jpg\", \"https://delirio.com.br/wp-content/uploads/2023/07/Cafetaria-01-BAIXA-CROP-SAT-BAIXA-2.jpg\", \"https://delirio.com.br/wp-content/uploads/2023/07/Estante-01-BAIXA-2-SAT-BAIXA.jpg\", \"https://delirio.com.br/wp-content/uploads/2023/07/Cafetaria-07-BAIXA-CROP-02-SAT-2.jpg\"]','https://www.google.com.br/maps/place/Del%C3%ADrio+Tropical/@-22.9977871,-43.3633218,17z/data=!3m2!4b1!5s0x9bda386cbb3325:0x1e314697b5c69e65!4m6!3m5!1s0x9bda4776586fe9:0xdc59dba649183dad!8m2!3d-22.9977921!4d-43.3607469!16s%2Fg%2F1vgqf9q3?entry=ttu','https://www.ifood.com.br/delivery/rio-de-janeiro-rj/delirio-tropical-barra-shopping-barra-da-tijuca/55e7f39e-71f3-4021-abfe-f834f9739dcb?utm_medium=share','https://cardapiodigital.delirio.com.br/delirio/24f7ac5d-c0e0-41cc-b971-cffdfdbfcc84','[\"Segunda a Sábado de 11h às 22h\", \"Dom e Feriados de 12h às 21h\"]','[\"(21) 3089-1170\"]','5521996091856','dtbshop@delirio.com.br',0,6,1,'2026-08-19 15:52:18.782','2026-08-19 15:52:18.782'),('cmt09sdwh0007vh74irja12u9','metropolitano','Metropolitano','[\"Av. Embaixador Abelardo Bueno 1.300, Loja 2027\"]','Barra da Tijuca, Rio de Janeiro | RJ','rio','https://delirio.com.br/wp-content/uploads/2023/07/Metropolitano-Baixa-2-NOVA.webp','[\"https://delirio.com.br/wp-content/uploads/2023/07/Delirio-Tropical-Shopping-Metropolitano-38-Editar.webp\", \"https://delirio.com.br/wp-content/uploads/2023/07/Delirio-Tropical-Shopping-Metropolitano-106-Editar.webp\", \"https://delirio.com.br/wp-content/uploads/2023/07/Delirio-Tropical-Shopping-Metropolitano-120-Editar-2.webp\", \"https://delirio.com.br/wp-content/uploads/2023/07/Delirio-Tropical-Shopping-Metropolitano-127-Editar.webp\", \"https://delirio.com.br/wp-content/uploads/2023/07/Delirio-Tropical-Shopping-Metropolitano-147-Editar.webp\", \"https://delirio.com.br/wp-content/uploads/2023/07/Delirio-Tropical-Shopping-Metropolitano-164-Editar.webp\"]','https://www.google.com.br/maps/place/Del%C3%ADrio+Tropical/@-22.9710475,-43.3749233,17z/data=!3m1!4b1!4m6!3m5!1s0x9bd97e850594df:0xc631567eecfced2b!8m2!3d-22.9710525!4d-43.3723484!16s%2Fg%2F11cjp83hb3?entry=ttu','https://www.ifood.com.br/delivery/rio-de-janeiro-rj/delirio-tropical-shopping-metropolitano-barra-da-tijuca/4213c6b1-f67f-489a-88b5-bf831cc0b2a1?utm_medium=share','https://cardapiodigital.delirio.com.br/delirio/9d7d132a-ca39-4c4e-90ac-7aaa891376d5','[\"Segunda a Sexta de 11h às 20h\", \"Sáb, Dom e Feriados de 12h às 20h\"]','[\"(21) 3500-5743\"]','5521999575839','dtmetro@delirio.com.br',0,7,1,'2026-08-19 15:52:18.785','2026-08-19 15:52:18.785'),('cmt09sdwk0008vh74egro3uit','plaza-niteroi','Plaza Niterói','[\"Rua Quinze de Novembro, 8 – Loja 323A\"]','Centro, Niterói | RJ','niteroi','https://delirio.com.br/wp-content/uploads/2023/06/Plaza-Niteroi-Baixa-5x5-591-px.jpg','[\"https://delirio.com.br/wp-content/uploads/2024/02/Delirio-Tropical-Plaza-Niteroi-223-Editar.jpg\", \"https://delirio.com.br/wp-content/uploads/2024/02/Capa-CROP.jpg\", \"https://delirio.com.br/wp-content/uploads/2024/02/Cafeteria-01-CROP.jpg\", \"https://delirio.com.br/wp-content/uploads/2024/02/Frente-letreiro-CROP-02.jpg\", \"https://delirio.com.br/wp-content/uploads/2024/02/Frente-letreiro-lateral-CROP-01-1.jpg\", \"https://delirio.com.br/wp-content/uploads/2024/02/Delirio-Tropical-Plaza-Niteroi-46-Editar.jpg\", \"https://delirio.com.br/wp-content/uploads/2024/02/Delirio-Tropical-Plaza-Niteroi-55-Editar.jpg\", \"https://delirio.com.br/wp-content/uploads/2024/02/Delirio-Tropical-Plaza-Niteroi-89-Editar.jpg\"]','https://maps.app.goo.gl/ohds9roGK72xjBAp6','https://www.ifood.com.br/delivery/niteroi-rj/delirio-tropical---plaza-niteroi-centro/da55ee43-c11a-4914-b4c2-0e173a028871?utm_medium=share','https://cardapiodigital.delirio.com.br/delirio/40e7e5e6-e7ce-488c-98c4-afabf650e969','[\"Segunda a Sábado de 11h às 22h\", \"Dom e Feriados de 12h às 21h\"]','[\"(21) 2391-7900\"]','5521997793453','dtniteroi@delirio.com.br',0,8,1,'2026-08-19 15:52:18.788','2026-08-19 15:52:18.788');
/*!40000 ALTER TABLE `store` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'delirio_admin'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-19 19:58:55
