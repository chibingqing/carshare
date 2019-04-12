@echo off
del /s /q E:\database\*.*
mongod --dbpath=E:\database
start

