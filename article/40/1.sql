select * from dbrank order by 总得分 desc
create table test8_01 as select * from test8_00

点 自动提交！！！

create table test1_student
(
    sid char(12) not null,
    name varchar(10) not null,
    sex char(2),
    age int,
    birthday date,
    dname varchar(30),
    class varchar(10)
);
create table test1_course
(
    cid char(6) not null,
    name varchar(40) not null,
    fcid char(6),
    credit numeric(4,1)
);
create table test1_student_course
(
    sid char(12) not null,
    cid char(6) not null,
    score numeric(5,1),
    tid char(6)
);
insert into test1_student
    values('200800020101','王欣', '女', 21, to_date('19940202', 'yyyymmdd'),'计算机学院','2010');
insert into test1_student
    values('200800020102','李华', '女', 20, to_date('19950303', 'yyyymmdd'),'软件学院','2009');
insert into test1_course
    values('300001', '数据结构', null, 2)
insert into test1_course
    values('300002', '数据库', '300001', 2.5)
insert into test1_student_course
    values('200800020101', '300001', 91.5, '100101')
insert into test1_student_course
    values('200800020101', '300002', 92.6, '100102')
2-1-0
Create or replace view test2_01 as
select sid, name
from pub.student
minus
select pub.student_course.sid, name
from pub.student_course, pub.student
where pub.student_course.sid = pub.student.sid

2-1-1

select sid, name
from pub.student
where sid not in (
    select pub.student_course.sid
    from pub.student_course
)

2-2

select sid, name
from pub.student
where sid in (
    select sid
    from pub.student_course
    where cid in (
        select cid
        from pub.student_course
        where sid = '200900130417'
    )
)

2-3
Create or replace view test2_02 as
select sid, name
from pub.student
where sid in (
    select sid
    from pub.student_course
    where cid in (    
        select cid
        from pub.course
        where fcid = '300002'
    )
)

2-4
Create or replace view test2_04 as
select sid, name
from pub.student
where sid in (
    select sid
    from pub.student_course
    where cid in (    
        select cid
        from pub.course
        where name = '操作系统'
    )
    intersect
    select sid
    from pub.student_course
    where cid in (    
        select cid
        from pub.course
        where name = '数据结构'
    )
)
2-5
Create or replace view test2_05 as
select sid, name, round(avg(score),0) avg_score, sum(score) sum_score
from pub.student natural join pub.student_course
where age = 20
group by sid, name


2-6
6． 查询所有课的最高成绩、次高成绩（次高成绩一定小于最高成绩）、最高成绩人数，
test2_06有四个列：课程号cid、课程名称name、最高成绩max_score、次高成绩max_score2、
最高成绩人数max_score_count（一个学生同一门课成绩都是第一，只计一次）。
如果没有学生选课，则最高成绩为空值,最高成绩人数为零。如果没有次高成绩，则次高成绩为空值。
-- Create or replace view test2_06 as
select cid, name, max_score, max_score2, max_score_count
from pub.course 
natural join 
(
    select cid, max(score) max_score
    from pub.student_course
    group by cid
)
-- 求次大成绩 筛选出 成绩小于最大成绩的再求最大值
natural join
(
    (
        select cid, max(score) max_score2
        from pub.student_course
        natural join 
        (
            select cid, max(score) max_score
            from pub.student_course
            group by cid
        )
        where score < max_score
        group by cid
    )
    -- ∪ 把不存在次大成绩的筛出来 单独加上
    union
    (
        select cid, null
        from pub.course
        where pub.course.cid not in 
        (
            (
                select cid
                from pub.student_course
                natural join 
                (
                    select cid, max(score) max_score
                    from pub.student_course
                    group by cid
                )
                where score < max_score
                group by cid
            )
        )
    )
)
-- 求最大值的人数 注意去重
natural join
(
    (
        select cid, count(score) max_score_count
        from 
        (
            select distinct sid, cid, score
            from pub.student_course
        )
        natural join 
        (
            select cid, max(score) max_score
            from pub.student_course
            group by cid
        )
        where score = max_score
        group by cid
    )
)

2-7
Create or replace view test2_07 as
select sid, name
from pub.student
minus
select sid, name
from pub.student
where name like '张%'
minus
select sid, name
from pub.student
where name like '李%'
minus
select sid, name
from pub.student
where name like '王%'

2-8
Create or replace view test2_08 as
select substr(name, 0, 1) second_name, count(substr(name, 0, 1)) p_count
from pub.student
group by substr(name, 0, 1)

2-9
Create or replace view test2_09 as

select distinct sid, name, score
from pub.student natural join pub.student_course
where cid = '300003'

2-10
Create or replace view test2_10 as


select sid, name
from pub.student natural join pub.student_course
where score < 60
group by sid, name, cid
having count(score) > 1

3-1
create table test3_01
(
    sid char(12) not null,
    name varchar(10) not null,
    sex varchar(10),
    age int,
    birthday date,
    dname varchar(30),
    class varchar(10)
);
insert into test3_01
select * from pub.student_31

select sid
from test3_01
where replace(translate(sid, '0123456789', '0'),'0','') is not null

delete from test3_01
where replace(translate(sid, '0123456789', '0'),'0','') is not null
-- translate 把0-9 转换成 0
-- replace 把0 换成null

3-2
create table test3_02
(
    sid char(12) not null,
    name varchar(10) not null,
    sex varchar(10),
    age int,
    birthday date,
    dname varchar(30),
    class varchar(10)
);
insert into test3_02
select * from pub.student_31

删除表中的出生日期和年龄(截止到2012年的年龄，即年龄=2012-出生年份)不一致的那些错误数据。
函数extract(year from birthday)返回birthday的年份

delete from test3_02
where 2012-extract(year from birthday) <> age

3-3
create table test3_03
(
    sid char(12) not null,
    name varchar(10) not null,
    sex varchar(10),
    age int,
    birthday date,
    dname varchar(30),
    class varchar(10)
);
insert into test3_03
select * from pub.student_31

delete from test3_03
where sex <> '男' and sex <> '女' 

3-4
create table test3_04
(
    sid char(12) not null,
    name varchar(10) not null,
    sex varchar(10),
    age int,
    birthday date,
    dname varchar(30),
    class varchar(10)
);
insert into test3_04
select * from pub.student_31

删除表中的院系名称有空格的、院系名称为空值的或者院系名称小于3个字的那些错误数据。

delete from test3_04
where dname is null or length(dname) < 3 or instr(dname, ' ') > 0

3-5
create table test3_05
(
    sid char(12) not null,
    name varchar(10) not null,
    sex varchar(10),
    age int,
    birthday date,
    dname varchar(30),
    class varchar(10)
);
insert into test3_05
select * from pub.student_31

delete from test3_05
where class in 
(
    select class
    from test3_05 natural join
    (
        select class, count(class) classnum
        from test3_05
        group by class
    )
    where classnum < 17
)

3-6
create table test3_06
(
    sid char(12) not null,
    name varchar(10) not null,
    sex varchar(10),
    age int,
    birthday date,
    dname varchar(30),
    class varchar(10)
);
insert into test3_06
select * from pub.student_31

insert into test3_06
select *
from test3_01
intersect
select *
from test3_02
intersect
select *
from test3_03
intersect
select *
from test3_04
intersect
select *
from test3_05

delete
from test3_06
where
class in 
(
    select class
    from test3_06 natural join
    (
        select class, count(class) classnum
        from test3_06
        group by class
    )
    where classnum < 17
)
or (replace(translate(sid, '0123456789', '0'),'0','') is not null) 
or (2012-extract(year from birthday) <> age)
or (length(name) < 2 or instr(name, ' ') > 0)
or (sex is not null and sex <> '男' and sex <> '女')
or (dname is null or instr(dname, ' ') > 0)
or (length(dname) < 3)

3-7
create table test3_07
(
    sid char(12) not null,
    cid char(6) not null,
    score numeric(5,1),
    tid char(6)
);
insert into test3_07
select * from pub.student_course_32

delete
from test3_07
where sid not in
(
    select sid
    from pub.student
)

3-8
create table test3_08
(
    sid char(12) not null,
    cid char(6) not null,
    score numeric(5,1),
    tid char(6)
);
insert into test3_08
select * from pub.student_course_32

delete
from test3_08
where (cid, tid) not in 
(
    select *
    from pub.teacher_course
)

3-9
create table test3_09
(
    sid char(12) not null,
    cid char(6) not null,
    score numeric(5,1),
    tid char(6)
);
insert into test3_09
select * from pub.student_course_32

delete
from test3_09
where
score in 
(
    select score
    from test3_09 natural join
    (
        select score, count(score) scorenum
        from test3_09
        group by score
    )
    where scorenum < 233
)

3-10
create table test3_10
(
    sid char(12) not null,
    cid char(6) not null,
    score numeric(5,1),
    tid char(6)
);
insert into test3_10
select * from pub.student_course_32

select *
from test3_10
where
score in 
(
    select score
    from test3_09 natural join
    (
        select score, count(score) scorenum
        from test3_09
        group by score
    )
    where scorenum < 233
)
or sid not in
(
    select sid
    from pub.student
)
or (cid, tid) not in 
(
    select *
    from pub.teacher_course
)
or cid not in 
(
    select cid
    from pub.course
)
or tid not in 
(
    select tid
    from pub.teacher
)

insert into test3_10
select *
from test3_09
intersect
select *
from test3_08
intersect
select *
from test3_07

delete
from test3_10
where
cid not in 
(
    select cid
    from pub.course
)
or tid not in 
(
    select tid
    from pub.teacher
)

4-1
create table test4_01
(
    sid char(12) not null,
    name varchar(10) not null,
    sex varchar(10),
    age int,
    birthday date,
    dname varchar(30),
    class varchar(10)
);

insert into test4_01
select *
from pub.student_41

alter table test4_01 add sum_score numeric(8,2)

update test4_01 X
set sum_score = (
    select sum(score) sum_score
    from pub.student_course Y
    where Y.sid = X.sid
)

4-2
create table test4_02
(
    sid char(12) not null,
    name varchar(10) not null,
    sex varchar(10),
    age int,
    birthday date,
    dname varchar(30),
    class varchar(10)
);

insert into test4_02
select *
from pub.student_41

alter table test4_02 add avg_score numeric(8,2)

update test4_02 X
set avg_score = round((
    select avg(score) avg_score
    from pub.student_course Y
    where Y.sid = X.sid
),1)

4-3
create table test4_03
(
    sid char(12) not null,
    name varchar(10) not null,
    sex varchar(10),
    age int,
    birthday date,
    dname varchar(30),
    class varchar(10)
);

insert into test4_03
select *
from pub.student_41

alter table test4_03 add sum_credit numeric(6,1)

update test4_03 Z
set sum_credit = 
(
    select sum(credit)
    from (
        select sid, cid, max(score) score1
        from pub.student_course
        where score >= 60
        group by sid, cid
    ) X  natural join pub.course Y
    where Z.sid = X.sid
    group by sid
)

4.4
将pub用户下表student_41及数据复制到主用户的表test4_04中。
根据列院系名称dname到pub.department找到对应院系编号did，
将对应的院系编号回填到院系名称列dname中，如果表中没有对应的院系名称，
则列dname中内容不变仍然是原来的内容。
create table test4_04
(
    sid char(12) not null,
    name varchar(10) not null,
    sex varchar(10),
    age int,
    birthday date,
    dname varchar(30),
    class varchar(10)
);

insert into test4_04
select *
from pub.student_41

update test4_04 
set dname = case
            when 
            (
                select did
                from pub.department
                where test4_04.dname = pub.department.dname
            ) is not null then 
            (
                select did
                from pub.department
                where test4_04.dname = pub.department.dname
            ) || dname
            else dname
    end

4.5
将pub用户下表student_41及数据复制到主用户的表test4_05中，使用alter table语句为表增加4个列："总成绩:sum_score"、 "平均成绩:avg_score"、"总学分:sum_credit"、"院系编号:did varchar(2) "。
（1） 利用pub.student_course、pub.course，统计 "总成绩"；
（2） 利用pub.student_course、pub.course，统计"平均成绩"，四舍五入到小数点后1位；
（3） 利用pub.student_course、pub.course，统计 "总学分"；
（4） 根据院系名称到pub.department或者pub.department_41中，找到对应编号，填写到院系编号中，如果都没有对应的院系，则填写为00。
create table test4_05
(
    sid char(12) not null,
    name varchar(10) not null,
    sex varchar(10),
    age int,
    birthday date,
    dname varchar(30),
    class varchar(10)
);
insert into test4_05
select *
from pub.student_41

alter table test4_05 add sum_score numeric(8,2)
alter table test4_05 add avg_score numeric(8,2)
alter table test4_05 add sum_credit numeric(6,1)
alter table test4_05 add did varchar(2)

update test4_05 X
set sum_score = (
    select sum(score) sum_score
    from pub.student_course Y
    where Y.sid = X.sid
)
update test4_05 X
set avg_score = round((
    select avg(score) avg_score
    from pub.student_course Y
    where Y.sid = X.sid
),1)
update test4_05 Z
set sum_credit = 
(
    select sum(credit)
    from (
        select sid, cid, max(score) score1
        from pub.student_course
        where score >= 60
        group by sid, cid
    ) X  natural join pub.course Y
    where Z.sid = X.sid
    group by sid
)
update test4_05
set did = case
            when 
            (
                select did
                from pub.department
                where test4_05.dname = pub.department.dname
            ) is not null then 
            (
                select did
                from pub.department
                where test4_05.dname = pub.department.dname
            )
            when 
            (
                select did
                from pub.department_41
                where test4_05.dname = pub.department_41.dname
            ) is not null then 
            (
                select did
                from pub.department_41
                where test4_05.dname = pub.department_41.dname
            )
            else '00'
    end

4-6
create table test4_06
(
    sid char(12) not null,
    name varchar(10) not null,
    sex varchar(10),
    age int,
    birthday date,
    dname varchar(30),
    class varchar(10)
);
insert into test4_06
select *
from pub.student_42

update test4_06
set name = replace(name, ' ', '')

4-7

create table test4_07
(
    sid char(12) not null,
    name varchar(10) not null,
    sex varchar(10),
    age int,
    birthday date,
    dname varchar(30),
    class varchar(10)
);
insert into test4_07
select *
from pub.student_42

update 
(
    select *
    from test4_07
    where sex in
    (
        select sex
        from test4_07 natural join
        (
            select sex, count(sex) sexnum
            from test4_07
            group by sex
        )
        where sexnum < 50
    )
)
set sex = case
        when instr(sex, '男') > 0 then '男'
        when instr(sex, '女') > 0 then '女'
        else sex
    end


4-8

create table test4_08
(
    sid char(12) not null,
    name varchar(10) not null,
    sex varchar(10),
    age int,
    birthday date,
    dname varchar(30),
    class varchar(10)
);
insert into test4_08
select *
from pub.student_42

update(
    select *
    from test4_08
    where class in
    (
        select class
        from test4_08 natural join
        (
            select class, count(class) classnum
            from test4_08
            group by class
        )
        where classnum < 15
    )
)
set class = substr(class, 0, length(class) - 1)

4-9
create table test4_09
(
    sid char(12) not null,
    name varchar(10) not null,
    sex varchar(10),
    age int,
    birthday date,
    dname varchar(30),
    class varchar(10)
);
insert into test4_09
select *
from pub.student_42

update(
    select *
    from test4_09
    where age is null
)
set age = case
            when age is null then 2012-extract(year from birthday)
            else age
        end


4-10
（1） 剔除姓名列中的所有空格；
（2） 剔除院系名称列中的所有空格；
（3） 对性别列进行规范（需要先确定哪些性别数据不规范，也就是那些和大多数不一样的就是不规范的）；
（4） 对班级列进行规范（需要先确定哪些班级不规范）。
（5） 年龄为空值的根据出生日期设置学生年龄（截止到2012年的年龄，即年龄=2012-出生年份），年龄不为空值的不要改变。
create table test4_10
(
    sid char(12) not null,
    name varchar(10) not null,
    sex varchar(10),
    age int,
    birthday date,
    dname varchar(30),
    class varchar(10)
);
insert into test4_10
select *
from pub.student_42

update test4_10
set name = replace(name, ' ', '')

update test4_10
set dname = replace(dname, ' ', '')

update 
(
    select *
    from test4_10
    where sex in
    (
        select sex
        from test4_10 natural join
        (
            select sex, count(sex) sexnum
            from test4_10
            group by sex
        )
        where sexnum < 50
    )
)
set sex = case
        when instr(sex, '男') > 0 then '男'
        when instr(sex, '女') > 0 then '女'
        else sex
    end

update(
    select *
    from test4_10
    where class in
    (
        select class
        from test4_10 natural join
        (
            select class, count(class) classnum
            from test4_10
            group by class
        )
        where classnum < 15
    )
)
set class = substr(class, 0, length(class) - 1)

update(
    select *
    from test4_10
    where age is null
)
set age = case
            when age is null then 2012-extract(year from birthday)
            else age
        end


5-1
在学生表pub.student中统计名字（姓名的第一位是姓氏，其余为名字，不考虑复姓）的使用的频率，将统计结果放入test5_01中，表结构如下。
First_name varchar(4) frequency numeric(4)
国强 1034
红 1232
卫东 2323

create table test5_01
(
    First_name varchar(4),
    frequency numeric(4)
);

insert into test5_01
select substr(name, 2, length(name) - 1), count(substr(name, 2, length(name) - 1))
from pub.student
group by substr(name, 2, length(name) - 1)

select substr(name, 2, length(name) - 1), count(substr(name, 2, length(name) - 1))
from pub.student
group by substr(name, 2, length(name) - 1)
order by count(substr(name, 2, length(name) - 1)) desc

5-2
letter varchar(2) frequency numeric(4)
create table test5_02
(
    letter varchar(2),
    frequency numeric(4)
);

筛出来每个字
更新时count每个字出现的次数
insert into test5_02
select letter, count(letter) frequency
from(
    select substr(name, 2, 1) letter
    from pub.student
    where length(name) = 2
    union all
    select substr(name, 2, 1) letter
    from pub.student
    where length(name) = 3
    union all
    select substr(name, 3, 1) letter
    from pub.student
    where length(name) = 3
)
group by letter

5-3
 创建"学院班级学分达标情况统计表1"test5_03，
 依据pub.student， pub.course，pub.student_course统计形成表中各项数据，成绩>=60为及格计入学分，总学分>=10为达标，院系为空值的数据不统计在下表中，
表结构：院系名称dname、班级class、学分达标人数p_count1、学分未达标人数p_count2、总人数p_count。
计算机学院 2006
计算机学院 2007
软件学院 2006

create table test5_03
(
    dname varchar(30),
    class varchar(10),
    p_count1 int,
    p_count2 int,
    p_count int
);

insert into test5_03
select dname, class, null, null, null
from pub.student
where dname is not null
group by dname, class

update test5_03 X
set p_count = 
(
    select count(class) p_count
    from pub.student Y
    where X.dname = Y.dname and X.class = Y.class
)

update test5_03 X
set p_count1 = 
(
    select count(class) p_count1
    from 
    (
        -- 筛选学分>=10
        select sid, sum(credit)
        from 
        (
            -- 筛选及格
            select sid, cid
            from pub.student_course
            where score >= 60
            group by sid, cid
        ) natural join pub.course
        group by sid
        having sum(credit) >= 10
    ) natural join pub.student
    where dname = X.dname and class = X.class
)
update test5_03 X
set p_count2 = 
(
    X.p_count - X.p_count1
)

5-4
 创建"学院班级学分达标情况统计表2"test5_04，依据pub.student， pub.course，pub.student_course统计形成表中各项数据，
 成绩>=60为及格计入学分，2008级及之前的班级总学分>=8为达标，2008级之后的班级学分>=10未达标，院系为空值的数据不统计在下表中，

表结构：院系名称dname、班级class、学分达标人数p_count1、学分未达标人数p_count2、总人数p_count。
Dname varchar(30) class varchar(10) P_count1 int P_count2 int P_count int
计算机学院 2006
计算机学院 2007
软件学院 2006
create table test5_04
(
    dname varchar(30),
    class varchar(10),
    p_count1 int,
    p_count2 int,
    p_count int
);

insert into test5_04
select dname, class, null, null, null
from pub.student
where dname is not null
group by dname, class

update test5_04 X
set p_count = 
(
    select count(class) p_count
    from pub.student Y
    where X.dname = Y.dname and X.class = Y.class
)

update test5_04 X
set p_count1 = case
    when X.class > '2008' then(
        select count(class) p_count1
        from 
        (
            -- 筛选学分>=10
            select sid, sum(credit)
            from 
            (
                -- 筛选及格
                select sid, cid
                from pub.student_course
                where score >= 60
                group by sid, cid
            ) natural join pub.course
            group by sid
            having sum(credit) >= 10
        ) natural join pub.student
        where dname = X.dname and class = X.class
    )
    else (
        select count(class) p_count1
        from 
        (
            -- 筛选学分>=10
            select sid, sum(credit)
            from 
            (
                -- 筛选及格
                select sid, cid
                from pub.student_course
                where score >= 60
                group by sid, cid
            ) natural join pub.course
            group by sid
            having sum(credit) >= 8
        ) natural join pub.student
        where dname = X.dname and class = X.class
    )
end
update test5_04 X
set p_count2 = 
(
    X.p_count - X.p_count1
)


5-5
注意事项：
如果一个学生一门课程有多次成绩，仅仅计算最高成绩，也就是只用他的最好成绩参加如下统计。
5． 查询各院系（不包括院系名称为空的）的数据结构平均成绩avg_ds_score、操作系统平均成绩avg_os_score，平均成绩四舍五入到个位，创建表test5_05，表结构及格式如下：
Dname Avg_ds_score Avg_os_score
马克思主义学院 72 70
软件学院 77 74
艺术学院 77 76
医学院 74 73

create table test5_05
(
    dname varchar(30),
    Avg_ds_score numeric(5,1),
    Avg_os_score numeric(5,1)
);
insert into test5_05
select dname, null, null
from pub.student
where dname is not null
group by dname

update test5_05 X
set Avg_ds_score = 
round((
    select avg(max_score) Avg_ds_score
    from 
    (
        select sid, max(score) max_score
        from pub.student_course natural join pub.course
        where pub.course.name = '数据结构'
        group by sid
    ) natural join pub.student
    where dname = X.dname
), 0)

update test5_05 X
set Avg_os_score = 
round((
    select avg(max_score) Avg_os_score
    from 
    (
        select sid, max(score) max_score
        from pub.student_course natural join pub.course
        where pub.course.name = '操作系统'
        group by sid
    ) natural join pub.student
    where dname = X.dname
), 0)


5-6
create table test5_06
(
    sid char(12) not null,
    name varchar(10) not null,
    dname varchar(30),
    ds_score numeric(5,1),
    os_score numeric(5,1)
);

insert into test5_06
select sid, name, dname, null, null
from pub.student
where dname = '计算机科学与技术学院' and
sid in
(
    select sid
    from pub.student_course natural join pub.course
    where pub.course.name = '数据结构'
) and 
sid in
(
    select sid
    from pub.student_course natural join pub.course
    where pub.course.name = '操作系统'
)
update test5_06
set ds_score = (
    select max(score) max_score 
    from pub.student_course natural join pub.course
    where pub.student_course.sid = test5_06.sid and pub.course.name = '数据结构'
)
update test5_06
set os_score = (
    select max(score) max_score 
    from pub.student_course natural join pub.course
    where pub.student_course.sid = test5_06.sid and pub.course.name = '操作系统'
)

5-7
create table test5_07
(
    sid char(12) not null,
    name varchar(10) not null,
    dname varchar(30),
    ds_score numeric(5,1),
    os_score numeric(5,1)
);

insert into test5_07
select sid, name, dname, null, null
from pub.student
where dname = '计算机科学与技术学院' and
(sid in
(
    select sid
    from pub.student_course natural join pub.course
    where pub.course.name = '数据结构'
) or 
sid in
(
    select sid
    from pub.student_course natural join pub.course
    where pub.course.name = '操作系统'
))

update test5_07
set ds_score = (
    select max(score) max_score 
    from pub.student_course natural join pub.course
    where pub.student_course.sid = test5_07.sid and pub.course.name = '数据结构'
)
update test5_07
set os_score = (
    select max(score) max_score 
    from pub.student_course natural join pub.course
    where pub.student_course.sid = test5_07.sid and pub.course.name = '操作系统'
)

5-8
create table test5_08
(
    sid char(12) not null,
    name varchar(10) not null,
    dname varchar(30),
    ds_score numeric(5,1),
    os_score numeric(5,1)
);

insert into test5_08
select sid, name, dname, null, null
from pub.student
where dname = '计算机科学与技术学院'

update test5_08
set ds_score = (
    select max(score) max_score 
    from pub.student_course natural join pub.course
    where pub.student_course.sid = test5_08.sid and pub.course.name = '数据结构'
)
update test5_08
set os_score = (
    select max(score) max_score 
    from pub.student_course natural join pub.course
    where pub.student_course.sid = test5_08.sid and pub.course.name = '操作系统'
)

6-1
例如：找出年龄小于20岁的所有学生的学号、姓名、年龄
正确执行:create view test6_00 as select sid，name，age from pub.student where age>20
Oracle扩展后方便写法：
create or replace view test6_00 as select sid，name，age from pub.student where age>20
直行select count(*) from test6_00 检查是否能够5分钟内查询出全部结果，如果超时说明可能有错误，这种情况下严禁执行"update dbtest set test=6"进行交卷。
找出年龄小于20岁且是"物理学院"的学生的学号、姓名、院系名称,按学号排序。

create or replace view test6_01 as
select sid, name, dname
from pub.student
where age < 20 and dname = '物理学院'
order by sid

6-2
查询统计2009级、软件学院每个学生的学号、姓名、总成绩（列名sum_score）。
create or replace view test6_02 as
select sid, name, sum(score) sum_score
from pub.student natural join pub.student_course
where class = '2009' and dname = '软件学院'
group by sid,name

6-3
查询2010级、计算机科学与技术学院、操作系统的学生成绩表，内容有学号、姓名、成绩。
create or replace view test6_03 as
    select sid, name, score
    from pub.student natural join (
        select sid, score
        from pub.student_course natural join pub.course
        where name = '操作系统'
    )
    where class = '2010' and dname = '计算机科学与技术学院'
6-4
找出选修"数据库系统"课程，且成绩大于90的学生的学号、姓名
create or replace view test6_04 as
    select sid, name
    from pub.student natural join (
        select sid
        from pub.student_course natural join pub.course
        where name = '数据库系统' and score > 90
    )
6-5
找出姓名叫"李龙"的学生的学号及其选修全部课程的课程号、课程名和成绩。
create or replace view test6_05 as
    select sid, cid, name, score
    from pub.student_course natural join pub.course
    where sid in (
        select sid
        from pub.student
        where name = '李龙'
    )

6-6

create or replace view test6_06 as

select sid, name
from pub.student X
where 
(
    select count(cid)
    from 
    (
        select distinct sid, cid
        from pub.student_course
    )
    where sid = X.sid
) 
=
(
    select count(*)
    from pub.course
)

6-7

create or replace view test6_07 as

select sid, name
from pub.student X
where 
(
    select count(cid)
    from 
    (
        select distinct sid, cid
        from pub.student_course
        where score >= 60
    )
    where sid = X.sid
) 
=
(
    select count(*)
    from pub.course
)


6-8
create or replace view test6_08 as
select cid, name
from pub.course X
where fcid is not null and
(
    select credit
    from pub.course Y
    where Y.credit = 2 and cid = X.fcid
) is not null

6-9

create or replace view test6_09 as
select sid, pub.student.name, sum(credit) sum_credit
from pub.student join 
(
    pub.student_course natural join pub.course
) using (sid)
where class = '2010' and dname = '化学与化工学院' and score >= 60
group by sid, pub.student.name

6-10
create or replace view test6_10 as
select cid, name
from pub.course X
where fcid is not null 
and
(
    select cid
    from pub.course Y
    where cid = X.fcid
) is not null 
and
(
    select cid
    from pub.course Y
    where cid = 
    (
        select fcid
        from pub.course Y
        where cid = X.fcid
    )
) is not null


7-1
drop table test7_01

create table test7_01
(
    sid char(12) not null,
    name varchar(10) not null,
    birthday date
);

insert into test7_01
select sid, name, birthday
from pub.student

select * 
from
(
    select sid,name,birthday,
        (
            select count(*) 
            from test7_01 
            -- where substr(name,1,1)=substr(t1.name,1,1)
            where name like substr(t1.name,1,1)||'%'
        ) samefirstname 
    from pub.student_testindex t1
)
where samefirstname=7

create index test7_01_test on test7_01(substr(name,1,1))

7-2
drop table test7_02

create table test7_02
(
    sid char(12) not null,
    name varchar(10) not null,
    birthday date
);

insert into test7_02
select sid, name, birthday
from pub.student
create index test7_02_birthday on test7_02(birthday)

7-3
1． pub用户下表student已经用下面两句SQL创建了两索引。
Create index student_birthday on student(birthday);
Create index student_name on student(name);
2． 下面SQL不能用索引耗时超过2秒，在逻辑不变情况下，修改SQL中标为记红色的子查询的where条件部分，不要修改其它地方，使其能使用索引。
说明：因为pub.student_testindex数据行数太少，不能通过修改主句where绕过问题。
查询samefirstname同姓氏的人数、samename同姓名的人数。
select * from
(select sid,name,birthday,
(select count(*) from pub.student
where substr(name,1,1)=substr(t1.name,1,1)
) samefirstname 
from pub.student_testindex t1) where samefirstname=7
3． 修改以后验证耗时在2秒之内，将修改以后语句创建成视图create view test7_03 as select ……。
4． 交卷验证


Create or replace view test7_03 as
select * from
(select sid,name,birthday,
(select count(*) from pub.student
where name like substr(t1.name,1,1)||'%'
) samefirstname 
from pub.student_testindex t1) where samefirstname=7

7-4
1． pub用户下表student已经用下面两句SQL创建了两索引。
Create index student_birthday on student(birthday);
Create index student_name on student(name);
2． 下面SQL不能用索引耗时超过1秒，在逻辑不变情况下，修改SQL中标为记红色的子查询的where条件部分，不要修改其它地方，使其能使用索引。
说明：因为pub.student_testindex数据行数太少，不能通过修改主句where绕过问题。
select * from 
(select sid,name,birthday,
(select count(*) from pub.student 
where to_char(birthday,'yyyymm')=to_char(t1.birthday,'yyyymm')
) sameyearmonth,
(select count(*) from pub.student 
where extract (year from birthday) =extract (year from t1.birthday)
) sameyear
 from pub.student_testindex t1) where sameyearmonth=35
3． 修改以后验证耗时在1秒之内，将修改以后语句创建成视图create view test7_04 as select ……。
4． 交卷验证
-- interval'1' month 加1月
create or replace view test7_04 as
select * from 
(select sid,name,birthday,
(select count(*) from pub.student X
where (birthday >= to_date(to_char(t1.birthday,'yyyymm'), 'yyyymm')) and (birthday < (to_date(to_char(t1.birthday,'yyyymm'), 'yyyymm')+interval'1' month))
) sameyearmonth,
(select count(*) from pub.student 
 where (birthday >= to_date(to_char(t1.birthday,'yyyy'), 'yyyy') - interval'8' month) and (birthday < (to_date(to_char(t1.birthday,'yyyy'), 'yyyy')+interval'1' year- interval'8' month))
) sameyear
 from pub.student_testindex t1) where sameyearmonth=35

7-5
1． pub用户下表student已经用下面两句SQL创建了两索引。
Create index student_birthday on student(birthday);
Create index student_name on student(name);
2． 下面SQL不能用索引耗时超过1秒，在逻辑不变情况下，修改SQL中标为记红色的子查询的where条件部分，不要修改其它地方，使其能使用索引。
说明：因为pub.student_testindex数据行数太少，不能通过修改主句where绕过问题。
查询nextbirthday晚一天出生的人数
select * from 
(select sid,name,birthday,
(select count(*) from pub.student 
where birthday-1=t1.birthday
) nextbirthday
from pub.student_testindex t1) where nextbirthday=7
3． 修改以后验证耗时在1秒之内，将修改以后语句创建成视图create view test7_05 as select ……。
4． 交卷验证
create or replace view test7_05 as
select * from 
(select sid,name,birthday,
(select count(*) from pub.student 
where birthday=t1.birthday+1
) nextbirthday
from pub.student_testindex t1) where nextbirthday=7


9-1
create table test9_01
(
    sid char(12) not null,
    name varchar(10) not null,
    sex varchar(10),
    age int,
    birthday date,
    dname varchar(30),
    class varchar(10)
);
create index test9_01_sid on test9_01(sid)

insert into test9_01
select *
from pub.student
where sex = '女'

insert into test9_01
select *
from pub.student_11_1
where sex = '女' and sid not in
(
    select sid
    from test9_01
)

insert into test9_01
select *
from pub.student_11_2
where sex = '女' and sid not in
(
    select sid
    from test9_01
)

9-2
create table test9_02
(
    sid char(12) not null,
    name varchar(10) not null,
    sex varchar(10),
    age int,
    birthday date,
    dname varchar(30),
    class varchar(10)
);
create index test9_02_sid on test9_02(sid)

insert into test9_02
select *
from pub.student
where sex = '女' and sid in 
(
    select distinct sid
    from pub.student_course
    where score < 60
)

insert into test9_02
select *
from pub.student_11_1
where sex = '女' and sid not in
(
    select sid
    from test9_02
) and sid in 
(
    select distinct sid
    from pub.student_course
    where score < 60
)

insert into test9_02
select *
from pub.student_11_2
where sex = '女' and sid not in
(
    select sid
    from test9_02
) and sid in 
(
    select distinct sid
    from pub.student_course
    where score < 60
)


8-2
create table test8_00
(
    tid char(6),
    name varchar(10) not null,
    sex char(2),
    age int,
    dname varchar(30)
);

insert into test8_00
select *
from pub.teacher

grant all on test8_00 to user201805130168

create table test8_10
(
    test varchar(20),
    age numeric(3)
);
delete test8_10 where test = '结果1'  and age = 88
insert into test8_10 values('结果1', 88)
insert into test8_10 values('结果2', 90)
insert into test8_10 values('结果3', 90)
insert into test8_10 values('结果4', 86)
insert into test8_10 values('结果5', 90)
insert into test8_10 values('结果6', 90)
insert into test8_10 values('结果7', 86)
insert into test8_10 values('结果8', 86)
insert into test8_10 values('结果9', 76)
insert into test8_10 values('结果10', 86)

update test8_10
set test = substr(test, 1, 2) || substr(test, 4, 1)

delete test8_10 where test = '结 果 1 '  and age = 88
insert into test8_10 values('结 果 1 ', 88)