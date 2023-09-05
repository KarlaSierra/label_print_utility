drop database label_print_utility;
create database label_print_utility;
use label_print_utility;

select * from ticket_gavilla;

Create table ticket_gavilla (
    id int primary key not null auto_increment, 
    n_paca varchar (30),
    clase varchar (50),
	variedad varchar (50),
    hojas_gavillas int,
    gavillas_funda int,
    hojas_fundas int,
    prom_gavillas int,
    cant_gavillas_fundas float,
    cant_gavillas_paca int,
    prom_hojas_paca float,
    cant_fundas_paca int,
	tamano varchar(4), 
    n_tickets int,
    fecha_elaboracion date,
    sobrante int
);

CREATE TABLE users (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    user VARCHAR(50),
    name VARCHAR(50),
    password LONGTEXT,
    rol VARCHAR(50)
);
