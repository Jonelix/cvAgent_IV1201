# How to GitHub



## 1. Pull main

git pull

## 2. Create your branch

git checkout -b branch_name

if you already have a branch

git checkout branch_name


## 3. Store your work

git add .

git commit -m "Commit naming"

git push

## 4. I want to merge with main

(Make sure you saved (control+s) all your work)

### 1. Make sure your main is updated

git checkout main

git pull

### 2. Go back to your back to your branch and store your stuff

git checkout branch_name

git add .

git commit -m "New stuff"

git push

### 3. Merge with Main

git merge main (then resolve conflicts)

git add .

git commit -m "Merged"

git push

### 4. Push branch to main

git checkout main

git merge branch_name

git push

### 5. Go back to your branch

git checkout branch_name

continue working...