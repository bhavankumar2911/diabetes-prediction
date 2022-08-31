from LogisticRegression import *
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import StandardScaler
import pickle

# read data 
data = pd.read_csv("diabetes.csv")

# splitting features and labels
X = data.drop('Outcome', axis=1)
Y = data['Outcome']

# scaling the features
scaler = StandardScaler()
X = scaler.fit_transform(X)

# splitting test set
X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size = 0.2, random_state = 1)

# training the model
lr = LogisticRegression(0.01, 1000)

lr.fit(X_train, Y_train)

# prediction for train data
Y_train_hat = lr.predict(X_train)

# checking accuracy
print("The accuracy for train data is {}".format(accuracy_score(Y_train, Y_train_hat)))

# prediction for test data
Y_test_hat = lr.predict(X_test)

print(Y_test_hat)

# checking accuracy
print("The accuracy for test data is {}".format(accuracy_score(Y_test, Y_test_hat)))

# testing for single instance
single_instance = [6, 148, 72, 35, 0, 33.6, 0.627, 50]

single_instance = scaler.transform(np.reshape(single_instance, (1, -1)))

print('scaled and reshaped -> {}'.format(single_instance))

result = lr.predict(single_instance)

print(result)

# dumping the model using pickle
modelFile = open("model.pickle", "wb")
scalerFile = open("scaler.pickle", 'wb')
pickle.dump(lr, modelFile)
pickle.dump(scaler, scalerFile)
modelFile.close()
scaler.close()

