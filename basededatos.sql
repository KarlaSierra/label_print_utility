create database label_print_utility;
use label_print_utility;

create table ticket_gavilla (
    id int primary key not null auto_increment, 
    n_paca varchar(15),
    clase varchar(30),
    variedad varchar(50),
    hojas_gavillas int,
    gavillas_funda int,
    hojas_fundas int,
    prom_gavillas int,
    cant_gavillas_fundas float,
    cant_gavillas_paca int,
    prom_hojas_paca float,
    cant_fundas_paca int,
    tamano varchar(10), 
    n_tickets int,
    fecha_elaboracion date,
    sobrante int,
    muestra_gavillas_sumatra int,
    gavilla_funda_sumatra int,  
    peso_funda_sumatra float,   
    cant_fundas_paca_sumatra int,  
    cant_gavillas_paca_sumatra float 
);

Create table users (
    id int primary key not null auto_increment,
    user varchar(30),
    name varchar(50),
    password longtext,
    rol varchar(50)
);
