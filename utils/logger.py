import os

def out(message):
  print(message)

def error(err):
  print('[ERROR] ', err)

def halt(err):
  error(err)
  # error('丢人，你马上给我退出战场。')
  os._exit()