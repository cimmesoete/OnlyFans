import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const DropdownButton = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownItems = [
    { label: 'New Post', value: 'newPost' },
    { label: 'Bio', value: 'bio' },
    { label: 'Sign Out', value: 'signOut' },
  ];

  return (
    <View>
      <TouchableOpacity onPress={() => setIsOpen(true)}>
        <Text>Show Dropdown</Text>
      </TouchableOpacity>

      <Modal transparent={true} visible={isOpen}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <DropDownPicker
            items={dropdownItems}
            containerStyle={{ width: 200 }}
            isVisible={isOpen}
            onOpen={() => setIsOpen(true)}
            onClose={() => setIsOpen(false)}
            onChangeItem={(item) => {
              onSelect(item.value);
              setIsOpen(false);
            }}
          />
        </View>
      </Modal>
    </View>
  );
};

export default DropdownButton;
