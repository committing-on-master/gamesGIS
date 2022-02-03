import { ComponentStory, ComponentMeta } from '@storybook/react';
import fetchMock from 'fetch-mock';
import { MapProfileType } from '../../../api/dto/response/ProfilesDTO';
import { MapType } from '../../../api/dto/types/MapType';
import { UserMapProfiles } from "./UserMapProfiles";

export default {
  title: 'profile/UserMapProfiles',
  component: UserMapProfiles,
} as ComponentMeta<typeof UserMapProfiles>;

const Template: ComponentStory<typeof UserMapProfiles> = (args) => <UserMapProfiles {...args}/>;

export const Primary = Template.bind({});
Primary.args = { userId: 32 };
Primary.play = () => {
  const data: MapProfileType[] = [
    {
      id: 1,
      map: MapType.Woods,
      name: "Campers positions",
      creationDate: new Date(),
      markersCount: 42
    },
    {
      id: 3,
      map: MapType.Woods,
      name: "Stashes",
      creationDate: new Date(),
      markersCount: 53
    },
    {
      id: 7,
      map: MapType.Labs,
      name: "Green!",
      creationDate: new Date(),
      markersCount: 1
    }
  ];

  fetchMock
      .restore()
      .get(
          "http://localhost:3000/api/map-profiles?userId=32",
          {
              status: 200,
              headers: { "Content-Type": "application/json" },

              body: JSON.stringify({
                  payload: data
              })
          },
          {
              delay: 4000
          }
      )
}
